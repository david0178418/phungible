import {action, observable} from 'mobx';
import * as moment from 'moment';
import 'moment-recur';
import {deserialize, identifier, list, object, serializable, serialize} from 'serializr';

import {setItem} from '../storage';
import Account from './account';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

export default
class AppStore {
	@action public static deserialize(data: any) {
		return deserialize(AppStore, data);
	}
	@serializable(identifier())
	public id = 1;
	@serializable(list(object(Account)))
	@observable public accounts: Account[];
	@serializable
	public lastUpdatedDate: string;
	@serializable(list(object(ScheduledTransaction)))
	@observable public scheduledTransactions: ScheduledTransaction[];
	@serializable(list(object(Transaction)))
	@observable public transactions: Transaction[];
	@serializable
	private _nextTransactionId = 1;

	get nextTransactionId() {
		return this._nextTransactionId++;
	}

	constructor() {
		this.accounts = observable([]);
		this.scheduledTransactions = observable([]);
		this.transactions = observable([]);
		this.lastUpdatedDate = moment(new Date(), 'MM/DD/YYYY').format('MM/DD/YYYY');
		(window as any).store = this;
	}

	public findAccount(accountId: number) {
		return this.accounts.find((account) => accountId === account.id);
	}
	public findRelatedScheduledTransactions(accountId: number) {
		return this.scheduledTransactions.filter((scheduledTrans) => scheduledTrans.affectsAccount(accountId));
	}
	public findScheduledTransaction(id: number) {
		return this.scheduledTransactions.find((scheduledTransaction) => scheduledTransaction.id === id);
	}
	public findTransaction(id: number) {
		return this.transactions.find((transaction) => transaction.id === id);
	}
	public save() {
		setItem('store', serialize(this));
	}
	public runTransactionSinceLastUpdate() {
		this.scheduledTransactions.forEach((scheduledTransaction) => {
			const lastUpdate = moment(this.lastUpdatedDate, 'MM/DD/YYYY');
			lastUpdate.add(1, 'day');
			this.runTransactions(scheduledTransaction, lastUpdate.format('MM/DD/YYYY'));
		});
	}
	@action public removeAccountFromScheduledTransactions(account: Account) {
		this.scheduledTransactions.forEach((scheduledTransaction) => {
			if(scheduledTransaction.fromAccount && scheduledTransaction.fromAccount.id === account.id) {
				scheduledTransaction.fromAccount = null;
			}

			if(scheduledTransaction.towardAccount && scheduledTransaction.towardAccount.id === account.id) {
				scheduledTransaction.towardAccount = null;
			}
		});
	}
	@action public removeAccountFromTransactions(account: Account) {
		this.transactions.forEach((transaction) => {
			if(transaction.fromAccount && transaction.fromAccount.id === account.id) {
				transaction.fromAccount = null;
			}

			if(transaction.towardAccount && transaction.towardAccount.id === account.id) {
				transaction.towardAccount = null;
			}
		});
	}
	@action public removeAccount(account: Account) {
		this.removeAccountFromTransactions(account);
		this.removeAccountFromScheduledTransactions(account);
		(this.accounts as any).remove(account);
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
				transaction.id = this.nextTransactionId;
				this.transactions.push(transaction);
			}
			lastUpdate.add(1, 'day');
		}

		this.sortTransactions();
	}
	@action public saveAccount(newAccount: Account) {
		if(!newAccount.id) {
			newAccount.id = Date.now();
			this.accounts.push(newAccount);
		} else {
			const index = this.accounts.findIndex((account) => account.id === newAccount.id);
			this.accounts[index] = newAccount;
		}
		this.save();
	}
	@action public saveScheduledTransaction(newScheduledTransaction: ScheduledTransaction) {
		if(!newScheduledTransaction.id) {
			newScheduledTransaction.id = Date.now();
			this.scheduledTransactions.push(newScheduledTransaction);

			if(moment().isSameOrBefore(newScheduledTransaction.startDate, 'days')) {
				if(newScheduledTransaction.repeats) {
					this.runTransactions(newScheduledTransaction, newScheduledTransaction.startDateString);
				} else {
					const transaction = newScheduledTransaction.generateTransaction(newScheduledTransaction.startDate);
					transaction.id = this.nextTransactionId;
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
			newTransaction.id = Date.now();
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
};
