import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import 'moment-recur';
import { identifier, serializable, serialize } from 'serializr';

import ItemTypeName from 'item-type-name';
import PouchStorage from '../shared/pouch-storage';
import {generateUuid, Money} from '../shared/utils';
import Account from './account';
import Budget from './budget';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

type ItemType = Account | Budget | ScheduledTransaction | Transaction;

export default
class AppStore {
	@action public static deserialize(data: any) {
		const {
			accounts,
			budgets,
			scheduledTransactions,
			transactions,
		} = data;
		const temp = new AppStore({
			accounts: accounts && accounts.map((a: any) => Account.deserialize(a)),
			budgets: budgets && budgets.map((b: any) => {
				return Budget.deserialize(b);
			}),
			scheduledTransactions: scheduledTransactions &&
				scheduledTransactions.map((s: any) => ScheduledTransaction.deserialize(s)),
			transactions: transactions && transactions.map((t: any) => Transaction.deserialize(t)),
		});
		temp.showTransactionConfirmation = !!temp.unconfirmedTransactions.length;
		return temp;
	}
	@serializable(identifier())
	public id: string;
	@observable public accounts: Account[];
	@observable public budgets: Budget[];
	@serializable
	public lastUpdatedDate: string;
	@observable public scheduledTransactions: ScheduledTransaction[];
	@observable public showTransactionConfirmation: boolean;
	@observable public transactions: Transaction[];

	@computed get unconfirmedTransactions() {
		return this.transactions.filter((transaction) => transaction.needsConfirmation);
	}

	constructor(params: Partial<AppStore> = {}) {
		Object.assign(this, {
			accounts: observable([]),
			budgets: observable([]),
			id: generateUuid(),
			lastUpdatedDate: moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY'),
			scheduledTransactions: observable([]),
			transactions: observable([]),
		}, params);

		(window as any).store = this;
	}

	public findAccount(accountId: string) {
		// tslint:disable-next-line:triple-equals
		return this.accounts.find((account) => accountId == account.id);
	}
	public findBudget(id: string) {
		// tslint:disable-next-line:triple-equals
		return this.budgets.find((budget) => budget.id == id);
	}
	public findRemainingBudgetBalance(id: string) {
		const budget = this.findBudget(id);
		const lastOccurance = moment(budget.lastOccurance);
		const totalRemaining = this.transactions
			.filter((transaction) => lastOccurance.isSameOrBefore(transaction.date, 'day'))
			.filter((transaction) => transaction.generatedFromBudget)
			.filter((transaction) => transaction.generatedFromBudget.id === budget.id)
			.reduce((amount, transaction) => amount - transaction.amount.valCents, budget.amount.valCents);

		return new Money(totalRemaining);
	}
	public findRelatedScheduledTransactions(accountId: string) {
		return this.scheduledTransactions.filter((scheduledTrans) => scheduledTrans.affectsAccount(accountId));
	}
	public findScheduledTransaction(id: string) {
		return this.scheduledTransactions.find((scheduledTransaction) => scheduledTransaction.id === id);
	}
	public findTransaction(id: string) {
		return this.transactions.find((transaction) => transaction.id === id);
	}
	public findTransactionsOnDate(date: Date) {
		const targetDate = moment(date);
		const transactions = this.transactions.filter((transaction) => moment(transaction.date).isSame(targetDate, 'days'));

		if(targetDate.isAfter(moment(), 'days')) {
			return transactions.concat(this.findFutureTransactionsOnDate(date));
		}

		return transactions;
	}
	public serialize() {
		return serialize(this);
	}
	public debugString() {
		return JSON.stringify(serialize(this));
	}
	@action public runTransactionSinceLastUpdate() {
		this.scheduledTransactions.forEach((scheduledTransaction) => {
			const lastUpdate = moment(this.lastUpdatedDate, 'MM/DD/YYYY');
			this.runTransactions(scheduledTransaction, lastUpdate.format('MM/DD/YYYY'));
		});
		this.showTransactionConfirmation = !!this.unconfirmedTransactions.length;
		this.lastUpdatedDate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY');
		this.save();
	}
	@action public clearAllData() {
		(this.accounts as any).clear();
		(this.budgets as any).clear();
		(this.scheduledTransactions as any).clear();
		(this.transactions as any).clear();
		PouchStorage
			.deleteDb()
			.then(() => PouchStorage.openDb(this.id));
	}
	@action public cleanScheduledTransactions() {
		const accountIds = this.accounts.map((account) => account.id);
		(this.scheduledTransactions as any).replace(
			this.scheduledTransactions
				.filter((schedTrans) => {
					let updated = false;

					if(schedTrans.fromAccount && accountIds.indexOf(schedTrans.fromAccount.id) === -1) {
						schedTrans.fromAccount = null;
						updated = true;
					}

					if(schedTrans.towardAccount && accountIds.indexOf(schedTrans.towardAccount.id) === -1) {
						schedTrans.towardAccount = null;
						updated = true;
					}

					if(!schedTrans.isValid) {
						PouchStorage.removeDoc(schedTrans);
					} else if(updated) {
						PouchStorage.saveDoc(schedTrans);
					}
				}),
			);
	}
	@action public cleanBudgets() {
		const accountIds = this.accounts.map((account) => account.id);
		this.budgets
			.forEach((budget) => {
				let updated = false;

				if(budget.fromAccount && accountIds.indexOf(budget.fromAccount.id) === -1) {
					budget.fromAccount = null;
					updated = true;
				}

				if(budget.towardAccount && accountIds.indexOf(budget.towardAccount.id) === -1) {
					budget.towardAccount = null;
					updated = true;
				}

				if(updated) {
					PouchStorage.saveDoc(budget);
				}
			});

		(this.budgets as any).replace(
			this.budgets.filter((budget) => budget.isValid),
		);
	}
	@action public cleanTransactions() {
		const accountIds = this.accounts.map((account) => account.id);
		this.transactions
			.forEach((transaction) => {
				let updated = false;

				if(transaction.fromAccount && accountIds.indexOf(transaction.fromAccount.id) === -1) {
					transaction.fromAccount = null;
					updated = true;
				}

				if(transaction.towardAccount && accountIds.indexOf(transaction.towardAccount.id) === -1) {
					transaction.towardAccount = null;
					updated = true;
				}

				if(updated) {
					PouchStorage.saveDoc(transaction);
				}
			});

		(this.transactions as any).replace(
			this.transactions.filter((schedTrans) => schedTrans.isValid),
		);
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	public removeItem(item: ItemType, typeName: ItemTypeName) {
		switch(typeName) {
			case 'Account':
				this.removeAccount(item as Account);
				break;
			case 'Budget':
				this.removeBudget(item as Budget);
				break;
			case 'Recurring Transaction':
				this.removeScheduledTransaction(item as ScheduledTransaction);
				break;
			case 'Transaction':
				this.removeTransaction(item as Transaction);
				break;
		}
	}
	@action public removeAccount(account: Account) {
		(this.accounts as any).remove(account);
		this.cleanBudgets();
		this.cleanScheduledTransactions();
		this.cleanTransactions();
		PouchStorage.removeDoc(account);
	}
	@action public removeBudget(budget: Budget) {
		(this.budgets as any).remove(budget);
		PouchStorage.removeDoc(budget);
	}
	@action public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		(this.scheduledTransactions as any).remove(scheduledTransaction);
		PouchStorage.removeDoc(scheduledTransaction);
	}
	@action public removeTransaction(transaction: Transaction) {
		(this.transactions as any).remove(transaction);
		PouchStorage.removeDoc(transaction);
	}
	@action public runTransactions(scheduledTransaction: ScheduledTransaction, from: string, needsConfirmation = true) {
		const lastUpdate = moment(from, 'MM/DD/YYYY');
		const daysSince = moment().diff(lastUpdate, 'days');

		for(let x = 0; x < daysSince; x++) {
			lastUpdate.add(1, 'day');
			if(scheduledTransaction.occursOn(lastUpdate)) {
				const transaction = scheduledTransaction.generateTransaction(lastUpdate.toDate(), needsConfirmation);
				transaction.id = generateUuid();
				this.transactions.push(transaction);
				PouchStorage.saveDoc(transaction);
			}
		}

		this.sortTransactions();
	}
	public save() {
		PouchStorage.saveDoc(this);
	}
	public saveItem(newItem: ItemType, type: ItemTypeName) {
		switch(type) {
			case 'Account':
				this.saveAccount(newItem as Account);
				break;
			case 'Budget':
				this.saveBudget(newItem as Budget);
				break;
			case 'Recurring Transaction':
				this.saveScheduledTransaction(newItem as ScheduledTransaction);
				break;
			case 'Transaction':
				this.saveScheduledTransaction(newItem as ScheduledTransaction);
				break;
		}
	}
	@action public saveAccount(newAccount: Account) {
		if(!newAccount.id) {
			newAccount.id = generateUuid();
			this.accounts.push(newAccount);
		} else {
			const index = this.accounts.findIndex((account) => account.id === newAccount.id);
			this.accounts[index] = newAccount;
		}
		PouchStorage.saveDoc(newAccount);
	}
	@action public saveBudget(newBudget: Budget) {
		if(!newBudget.id) {
			newBudget.id = generateUuid();
			this.budgets.push(newBudget);
		} else {
			const index = this.budgets.findIndex(
				(budget) => budget.id === newBudget.id,
			);
			this.budgets[index] = newBudget;
		}
		PouchStorage.saveDoc(newBudget);
	}
	@action public saveScheduledTransaction(newScheduledTransaction: ScheduledTransaction) {
		if(!newScheduledTransaction.id) {
			newScheduledTransaction.id = generateUuid();
			this.scheduledTransactions.push(newScheduledTransaction);

			if(moment().isSameOrAfter(newScheduledTransaction.startDate, 'days')) {
				if(newScheduledTransaction.repeats) {
					this.runTransactions(newScheduledTransaction, newScheduledTransaction.startDateString, false);
				} else {
					const transaction = newScheduledTransaction.generateTransaction(newScheduledTransaction.startDate, false);
					transaction.id = generateUuid();
					this.transactions.push(transaction);
				}
			}
		} else {
			const index = this.scheduledTransactions.findIndex(
				(scheduledTransaction) => scheduledTransaction.id === newScheduledTransaction.id,
			);
			this.scheduledTransactions[index] = newScheduledTransaction;
			// TODO figure out how to handle "startDate" updates
		}

		this.sortTransactions();
		PouchStorage.saveDoc(newScheduledTransaction);
	}
	@action public saveTransaction(newTransaction: Transaction) {
		if(!newTransaction.id) {
			newTransaction.id = generateUuid();
			this.transactions.push(newTransaction);
		} else {
			const index = this.transactions.findIndex((transaction) => transaction.id === newTransaction.id);
			this.transactions[index] = newTransaction;
		}
		this.sortTransactions();
		PouchStorage.saveDoc(newTransaction);
	}
	@action public sortTransactions() {
		(this.transactions as any).replace(this.transactions.sort((a, b) => {
			return a.date.getTime() - b.date.getTime();
		}));
	}
	public getBalanceAsOfDate(account: Account, date: Date) {
		const lastBalanceUpdate = account.lastBalanceUpdateAsOf(date);

		if(!lastBalanceUpdate) {
			return null;
		}

		if(lastBalanceUpdate.date.isSame(date, 'day')) {
			return lastBalanceUpdate.amount;
		}

		const transactions = this.transactions
			.filter((transaction) => !transaction.needsConfirmation)
			.filter((transaction) => {
				return (
					(transaction.fromAccount && transaction.fromAccount.id === account.id) ||
					(transaction.towardAccount && transaction.towardAccount.id === account.id)
				);
			})
			.filter((transaction) => (lastBalanceUpdate.date.isBefore(transaction.date, 'day')))
			.filter((transaction) => (moment(transaction.date).isSameOrBefore(date, 'day')));

		return account.applyTransactions(transactions, date);
	}
	public getBalanceExpectation(account: Account, date: Date) {
		// yesterday's expectation plus given day's transactions
		const dayPriorExpectation = this.getBalanceAsOfDate(account, moment(date).subtract(1, 'day').toDate());

		if(!dayPriorExpectation) {
			return  this.getBalanceAsOfDate(account, date);
		}

		const dateMoment = moment(date);

		const dateTransactions = this.transactions
			.filter((transaction) => dateMoment.isSame(transaction.date, 'day'));
		const fromAmount = dateTransactions
			.filter((transaction) => transaction.fromAccount)
			.filter((transaction) => transaction.fromAccount.id === account.id)
			.reduce((total, val) => total + val.amount.valCents, 0);
		const towardAmount = dateTransactions
			.filter((transaction) => transaction.towardAccount)
			.filter((transaction) => transaction.towardAccount.id === account.id)
			.reduce((total, val) => total + val.amount.valCents, 0);

		dayPriorExpectation.addCents(
			(fromAmount * account.fromBalanceDirection) +
			(towardAmount * account.towardBalanceDirection),
		);

		return dayPriorExpectation;
	}
	public getBalanceExpectationDifference(account: Account, date: Date) {
		const actualAmount = this.getBalanceAsOfDate(account, date);
		const expectedAmount = this.getBalanceExpectation(account, date);

		if(!actualAmount && expectedAmount) {
			return expectedAmount;
		}

		if(!expectedAmount && actualAmount) {
			return actualAmount;
		}

		if(!(expectedAmount || actualAmount)) {
			// or null??
			return new Money();
		}

		return new Money(actualAmount.valCents - expectedAmount.valCents);
	}
	public getPendingChange(account: Account) {
		const pendingConfirmation = this.transactions
			.filter((transaction) => !!transaction.needsConfirmation);

		return new Money(
			pendingConfirmation
				.filter((transaction) => !!transaction.fromAccount)
				.filter((transaction) => transaction.fromAccount.id === account.id)
				.reduce((total, transaction) => total + transaction.amount.valCents, 0)
				* account.fromBalanceDirection
			+
			pendingConfirmation
				.filter((transaction) => !!transaction.towardAccount)
				.filter((transaction) => transaction.towardAccount.id === account.id)
				.reduce((total, transaction) => total + transaction.amount.valCents, 0)
				* account.towardBalanceDirection,
		);
	}
	private findFutureTransactionsOnDate(date: Date) {
		const scheduledTransactions =
			this.scheduledTransactions.filter((scheduledTransaction) => scheduledTransaction.occursOn(date));

		return scheduledTransactions.map((scheduledTransaction) => scheduledTransaction.generateTransaction(date));
	}
}
