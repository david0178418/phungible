import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import 'moment-recur';
import {deserialize, identifier, list, object, serializable, serialize} from 'serializr';

import ItemTypeName from 'item-type-name';
import {generateUuid, Money} from '../shared/utils';
import Account from './account';
import ProfilesStore from './profiles';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

type ItemType = Account | ScheduledTransaction | Transaction;

export default
class AppStore {
	@action public static deserialize(data: any) {
		const temp = deserialize(AppStore, data);
		temp.tempFixReferencesBug();
		temp.showTransactionConfirmation = !!temp.unconfirmedTransactions.length;
		return temp;
	}
	@serializable(identifier())
	public id: string;
	@serializable(list(object(Account)))
	@observable public accounts: Account[];
	@serializable(list(object(ScheduledTransaction)))
	@observable public budgets: ScheduledTransaction[];
	@serializable
	public lastUpdatedDate: string;
	@serializable(list(object(ScheduledTransaction)))
	@observable public scheduledTransactions: ScheduledTransaction[];
	@observable public showTransactionConfirmation: boolean;
	@serializable(list(object(Transaction)))
	@observable public transactions: Transaction[];

	@computed get unconfirmedTransactions() {
		return this.transactions.filter((transaction) => transaction.needsConfirmation);
	}

	constructor() {
		this.id = generateUuid();
		this.accounts = observable([]);
		this.budgets = observable([]);
		this.scheduledTransactions = observable([]);
		this.transactions = observable([]);
		this.lastUpdatedDate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY');
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
			.filter((transaction) => transaction.generatedFrom)
			.filter((transaction) => transaction.generatedFrom.id === budget.id)
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
	public save() {
		ProfilesStore.saveCurrentProfileData(serialize(this));
	}
	public saveAll() {
		this.save();
		ProfilesStore.saveCurrentProfile();
		ProfilesStore.saveProfiles();
	}
	public debugString() {
		return JSON.stringify(serialize(this));
	}
	public runTransactionSinceLastUpdate() {
		this.scheduledTransactions.forEach((scheduledTransaction) => {
			const lastUpdate = moment(this.lastUpdatedDate, 'MM/DD/YYYY');
			lastUpdate.add(1, 'day');
			this.runTransactions(scheduledTransaction, lastUpdate.format('MM/DD/YYYY'));
		});
		this.lastUpdatedDate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY');
	}
	@action public clearAllData() {
		(this.accounts as any).clear();
		(this.budgets as any).clear();
		(this.scheduledTransactions as any).clear();
		(this.transactions as any).clear();
		this.save();
	}
	@action public cleanScheduledTransactions() {
		const accountIds = this.accounts.map((account) => account.id);
		this.scheduledTransactions
			.forEach((schedTrans) => {
				if(schedTrans.fromAccount && accountIds.indexOf(schedTrans.fromAccount.id) === -1) {
					schedTrans.fromAccount = null;
				}

				if(schedTrans.towardAccount && accountIds.indexOf(schedTrans.towardAccount.id) === -1) {
					schedTrans.towardAccount = null;
				}
			});

		(this.scheduledTransactions as any).replace(
			this.scheduledTransactions.filter((schedTrans) => schedTrans.isValid),
		);
	}
	@action public cleanBudgets() {
		const accountIds = this.accounts.map((account) => account.id);
		this.budgets
			.forEach((budget) => {
				if(budget.fromAccount && accountIds.indexOf(budget.fromAccount.id) === -1) {
					budget.fromAccount = null;
				}

				if(budget.towardAccount && accountIds.indexOf(budget.towardAccount.id) === -1) {
					budget.towardAccount = null;
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
				if(transaction.fromAccount && accountIds.indexOf(transaction.fromAccount.id) === -1) {
					transaction.fromAccount = null;
				}

				if(transaction.towardAccount && accountIds.indexOf(transaction.towardAccount.id) === -1) {
					transaction.towardAccount = null;
				}
			});

		(this.transactions as any).replace(
			this.transactions.filter((schedTrans) => schedTrans.isValid),
		);
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
		this.save();
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
				this.removeBudget(item as ScheduledTransaction);
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

		this.save();
	}
	@action public removeBudget(budget: ScheduledTransaction) {
		(this.budgets as any).remove(budget);
		this.save();
	}
	@action public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		(this.scheduledTransactions as any).remove(scheduledTransaction);
		this.save();
	}
	@action public removeTransaction(transaction: Transaction) {
		(this.transactions as any).remove(transaction);
		this.save();
	}
	@action public runTransactions(scheduledTransaction: ScheduledTransaction, from: string) {
		const lastUpdate = moment(from, 'MM/DD/YYYY');
		const daysSince = moment().diff(lastUpdate, 'days');

		for(let x = 0; x <= daysSince; x++) {
			if(scheduledTransaction.occursOn(lastUpdate)) {
				const transaction = scheduledTransaction.generateTransaction(lastUpdate.toDate());
				transaction.id = generateUuid();
				this.transactions.push(transaction);
			}
			lastUpdate.add(1, 'day');
		}

		this.sortTransactions();
	}
	public saveItem(newItem: ItemType, type: ItemTypeName) {
		switch(type) {
			case 'Account':
				this.saveAccount(newItem as Account);
				break;
			case 'Budget':
				this.saveBudget(newItem as ScheduledTransaction);
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
		this.save();
	}
	@action public saveBudget(newBudget: ScheduledTransaction) {
		if(!newBudget.id) {
			newBudget.id = generateUuid();
			this.budgets.push(newBudget);
		} else {
			const index = this.budgets.findIndex(
				(budget) => budget.id === newBudget.id,
			);
			this.budgets[index] = newBudget;
		}
		this.save();
	}
	@action public saveScheduledTransaction(newScheduledTransaction: ScheduledTransaction) {
		if(!newScheduledTransaction.id) {
			newScheduledTransaction.id = generateUuid();
			this.scheduledTransactions.push(newScheduledTransaction);

			if(moment().isSameOrBefore(newScheduledTransaction.startDate, 'days')) {
				if(newScheduledTransaction.repeats) {
					this.runTransactions(newScheduledTransaction, newScheduledTransaction.startDateString);
				} else {
					const transaction = newScheduledTransaction.generateTransaction(newScheduledTransaction.startDate);
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
		this.save();
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
		this.save();
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

		const today = new Date();

		if(lastBalanceUpdate.date.isSame(today, 'day')) {
			return lastBalanceUpdate.amount;
		}

		const transactions = this.transactions
			.filter((transaction) => !transaction.needsConfirmation)
			.filter((transaction) => (
				lastBalanceUpdate.date.isBefore(transaction.date, 'day') &&
				moment(transaction.date).isSameOrBefore(today, 'day')
			));

		return account.applyTransactions(transactions, today);
	}
	private findFutureTransactionsOnDate(date: Date) {
		const scheduledTransactions =
			this.scheduledTransactions.filter((scheduledTransaction) => scheduledTransaction.occursOn(date));

		return scheduledTransactions.map((scheduledTransaction) => scheduledTransaction.generateTransaction(date));
	}

	private tempFixReferencesBug() {
		this.scheduledTransactions.concat(this.budgets).map((schedTrans) => {
			if(schedTrans.fromAccount) {
				schedTrans.fromAccount = this.findAccount(schedTrans.fromAccount.id);
			}
			if(schedTrans.towardAccount) {
				schedTrans.towardAccount = this.findAccount(schedTrans.towardAccount.id);
			}
		});
	}
}
