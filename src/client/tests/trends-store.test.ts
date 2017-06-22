// tslint:disable:object-literal-sort-keys
// tslint:disable:no-unused-expression
import {expect} from 'chai';

import TrendsStore from '../stores/trends';

// TODO Figure out circular dependency to properly import these
// TransactionTypes
// 	BudgetedExpense: 0,
// 	Expense: 1
// 	Income: 2

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

const AccountFoo100 = {
	id: '1',
	name: 'Foo',
	balanceUpdateHistory: [{
		balance: {
			totalValCents: 100,
		},
		_date: '01/02/2015',
	}],
};

describe('Trend Store', () => {
	it('should log account balances', () => {
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			scheduleTransactions: [],
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
		const trendsStore = TrendsStore.deserialize({
			today,
			accounts: [AccountFoo100],
			scheduledTransactions: [{
				today,
				_repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: {
					totalValCents: 100,
				},
				id: '1',
				type: 1, // Expense
				_startDate: '01/02/2015',
				fromAccount: AccountFoo100,
			}],
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
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [{
				today,
				_repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: {
					totalValCents: 100,
				},
				id: '1',
				type: 0, // BudgetedExpense
				_startDate: '01/03/2015',
				fromAccount: AccountFoo100,
			}],
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
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [{
				today,
				_repeatType: 1, // Dates
				_repeatValues: [
					3, // 3rd of the month
				],
				amount: {
					totalValCents: 100,
				},
				id: '1',
				type: 0, // BudgetedExpense
				_startDate: '01/03/2015',
				fromAccount: AccountFoo100,
			}],
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
		const BudgetBar = {
			today,
			_repeatType: 1, // Dates
			_repeatValues: [
				3, // 3rd of the month
			],
			amount: {
				totalValCents: 100,
			},
			id: '1',
			type: 0, // BudgetedExpense
			_startDate: '01/03/2015',
			fromAccount: AccountFoo100,
		};
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [BudgetBar],
			transactions: [{
				amount: {
					totalValCents: 50,
				},
				_dateString: '01/04/2015',
				type: 0, // BudgetedExpense
				fromAccount: AccountFoo100,
				generatedFrom: BudgetBar,
			}],
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

	it('should count transactions that break budgets during working period', () => {
		const today = new Date('01/03/2015');
		const BudgetBar = {
			today,
			_repeatType: 1, // Dates
			_repeatValues: [
				3, // 3rd of the month
			],
			amount: {
				totalValCents: 100,
			},
			id: '1',
			type: 0, // BudgetedExpense
			_startDate: '01/03/2015',
			fromAccount: AccountFoo100,
		};
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			scheduledTransactions: [],
			budgets: [BudgetBar],
			transactions: [{
				amount: {
					totalValCents: 150,
				},
				_dateString: '01/04/2015',
				type: 0, // BudgetedExpense
				fromAccount: AccountFoo100,
				generatedFrom: BudgetBar,
			}],
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
		const trendsStore = TrendsStore.deserialize({
			accounts: [AccountFoo100],
			budgets: [],
			scheduledTransactions: [],
			transactions: [{
				amount: {
					totalValCents: 100,
				},
				_dateString: '01/03/2015',
				type: 0, // BudgetedExpense
				fromAccount: AccountFoo100,
			}],
		});

		trendsStore.today = today;

		trendsStore.fromDate = new Date('01/03/2015');
		trendsStore.toDate = new Date('02/04/2015');

		const data = trendsStore.formattedData;

		expect(data[0].Foo).to.equal(0);
		expect(data[0].Total).to.equal(0);
	});
});
