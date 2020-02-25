// tslint:disable:object-literal-sort-keys
// tslint:disable:no-unused-expression
import {expect} from 'chai';

import {TransactionType} from '../constants';
import Money from '../shared/utils/money';
import Account from '../stores/account';
import BalanceUpdateHistory from '../stores/balance-update';
import Budget from '../stores/budget';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Transaction from '../stores/transaction';
import TrendsStore from '../stores/trends';

// TODO Figure out circular dependency to properly import these

// RepeatTypes
// 	Days: 0
// 	Dates: 1
// 	Interval: 2

// RepeatDays
// 	Su: 0
// 	Mo: 1
// 	Tu: 2
// 	We: 3
// 	Th: 4
// 	Fr: 5
// 	Sa: 6

// RepeatUnits
// 	Day: 0
// 	Week: 1
// 	Month: 2
// 	Year: 3
// 	None: 4

(global as any).window = {};

const AccountFoo100 = new Account({
	id: '1',
	name: 'Foo',
	balanceUpdateHistory: [
		new BalanceUpdateHistory({
			balance: new Money(100),
			date: new Date('01/02/2015'),
		}),
	],
});

describe('Trend Store', () => {
	it('should log account balances', () => {
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [],
			transactions: [],
		});

		trendsStore.fromDate = new Date('01/01/2015');
		trendsStore.toDate = new Date('01/2/2015');
		trendsStore.toDate = new Date('01/2/2015');

		const data = trendsStore.formattedData;

		expect(data.length).to.equal(2);
		expect(data[0].Foo).to.be.undefined;
		expect(data[0].Total).to.be.undefined;
		expect(data[1].Foo).to.equal(100);
		expect(data[1].Total).to.equal(100);
	});

	it('should add scheduled transactions', () => {
		const today = new Date('01/02/2015');
		const trendsStore = new TrendsStore({
			today,
			accounts: [AccountFoo100],
			scheduledTransactions: [new ScheduledTransaction({
				today,
				repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: new Money(100),
				id: '1',
				transactionType: TransactionType.Expense,
				startDate: new Date('01/02/2015'),
				fromAccount: AccountFoo100,
			})],
			budgets: [],
			transactions: [],
		});

		trendsStore.today = today;
		trendsStore.scheduledTransactions[0].today = today;

		trendsStore.fromDate = new Date('01/01/2015');
		trendsStore.toDate = new Date('02/03/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.be.undefined;
		expect(data[0].Total).to.be.undefined;
		expect(data[1].Foo).to.equal(100);
		expect(data[1].Total).to.equal(100);
		expect(data[data.length - 2].Foo).to.equal(0);
		expect(data[data.length - 2].Total).to.equal(0);
	});

	it('should add budgeted amounts', () => {
		const today = new Date('01/02/2015');
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [new Budget({
				today,
				repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: new Money(100),
				id: '1',
				transactionType: TransactionType.BudgetedExpense,
				startDate: new Date('01/03/2015'),
				fromAccount: AccountFoo100,
			})],
			transactions: [],
		});

		trendsStore.today = today;
		trendsStore.budgets[0].today = today;

		trendsStore.fromDate = new Date('01/01/2015');
		trendsStore.toDate = new Date('02/03/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.be.undefined;
		expect(data[0].Total).to.be.undefined;
		expect(data[1].Foo).to.equal(100);
		expect(data[1].Total).to.equal(100);
		expect(data[2].Foo).to.equal(0);
		expect(data[2].Total).to.equal(0);
		expect(data[data.length - 2].Foo).to.equal(0);
		expect(data[data.length - 2].Total).to.equal(0);
		expect(data[data.length - 1].Foo).to.equal(-100);
		expect(data[data.length - 1].Total).to.equal(-100);
	});

	it('should ignore budget amounts prior to current period', () => {
		const today = new Date('02/03/2015');
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [new Budget({
				today,
				repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: new Money(100),
				id: '1',
				transactionType: TransactionType.BudgetedExpense,
				startDate: new Date('01/03/2015'),
				fromAccount: AccountFoo100,
			})],
			transactions: [],
		});

		trendsStore.today = today;
		trendsStore.budgets[0].today = today;

		trendsStore.fromDate = new Date('01/01/2015');
		trendsStore.toDate = new Date('02/03/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.be.undefined;
		expect(data[0].Total).to.be.undefined;
		expect(data[1].Foo).to.equal(100);
		expect(data[1].Total).to.equal(100);
		expect(data[2].Foo).to.equal(100);
		expect(data[2].Total).to.equal(100);
		expect(data[data.length - 2].Foo).to.equal(100);
		expect(data[data.length - 2].Total).to.equal(100);
		expect(data[data.length - 1].Foo).to.equal(0);
		expect(data[data.length - 1].Total).to.equal(0);
	});

	it('should not be affected by budgeted transactions during working period', () => {
		const today = new Date('01/03/2015');
		const BudgetBar = new Budget({
			today,
			repeatType: 1, // Dates
			_repeatValues: [
				3, // 3rd of the month
			],
			amount: new Money(100),
			id: '1',
			transactionType: TransactionType.BudgetedExpense,
			startDate: new Date('01/03/2015'),
			fromAccount: AccountFoo100,
		});
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [BudgetBar],
			transactions: [new Transaction({
				amount: new Money(50),
				date: new Date('01/04/2015'),
				transactionType: TransactionType.BudgetedExpense,
				fromAccount: AccountFoo100,
				generatedFromBudget: BudgetBar,
			})],
		});

		trendsStore.today = today;
		trendsStore.budgets[0].today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('02/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(0);
		expect(data[0].Total).to.equal(0);
		expect(data[1].Foo).to.equal(0);
		expect(data[1].Total).to.equal(0);
		expect(data[data.length - 1].Foo).to.equal(-100);
		expect(data[data.length - 1].Total).to.equal(-100);
	});

	it('should show budget overages during working period', () => {
		const today = new Date('01/03/2015');
		const BudgetBar = new Budget({
			today,
			repeatType: 1, // Dates
			_repeatValues: [
				3, // 3rd of the month
			],
			amount: new Money(100),
			id: '1',
			transactionType: TransactionType.BudgetedExpense,
			startDate: new Date('01/03/2015'),
			fromAccount: AccountFoo100,
		});
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [BudgetBar],
			transactions: [new Transaction({
				amount: new Money(150),
				date: new Date('01/04/2015'),
				transactionType: TransactionType.BudgetedExpense,
				fromAccount: AccountFoo100,
				generatedFromBudget: BudgetBar,
			})],
		});

		trendsStore.today = today;
		trendsStore.budgets[0].today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('02/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(0);
		expect(data[0].Total).to.equal(0);
		expect(data[1].Foo).to.equal(-50);
		expect(data[1].Total).to.equal(-50);
		expect(data[data.length - 1].Foo).to.equal(-150);
		expect(data[data.length - 1].Total).to.equal(-150);
	});

	it('should apply unscheduled transactions', () => {
		const today = new Date('01/03/2015');
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			budgets: [],
			scheduledTransactions: [],
			transactions: [new Transaction({
				amount: new Money(100),
				date: new Date('01/03/2015'),
				transactionType: TransactionType.BudgetedExpense,
				fromAccount: AccountFoo100,
			})],
		});

		trendsStore.today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('02/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(0);
		expect(data[0].Total).to.equal(0);
	});

	it('should not apply pending transactions', () => {
		const today = new Date('01/03/2015');
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [],
			transactions: [new Transaction({
				needsConfirmation: true,
				amount: new Money(50),
				date: new Date('01/04/2015'),
				transactionType: TransactionType.Expense,
				fromAccount: AccountFoo100,
			})],
		});

		trendsStore.today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('01/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(100);
		expect(data[0].Total).to.equal(100);
		expect(data[1].Foo).to.equal(100);
		expect(data[1].Total).to.equal(100);
	});

	it('should apply confirmed transactions', () => {
		const today = new Date('01/03/2015');
		const trendsStore = new TrendsStore({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [],
			transactions: [new Transaction({
				needsConfirmation: false,
				amount: new Money(50),
				date: new Date('01/04/2015'),
				transactionType: TransactionType.Expense,
				fromAccount: AccountFoo100,
			})],
		});

		trendsStore.today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('01/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(100);
		expect(data[0].Total).to.equal(100);
		expect(data[1].Foo).to.equal(50);
		expect(data[1].Total).to.equal(50);
	});
});
