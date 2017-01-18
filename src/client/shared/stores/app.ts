import {action, observable} from 'mobx';
import {deserialize, identifier, list, object, serializable, serialize} from 'serializr';

import {setItem} from '../storage';
import Account from './account';
import ScheduledTransaction from './scheduled-transaction';

export default
class AppStore {
	@action public static deserialize(data: any) {
		return deserialize(AppStore, data);
	}
	@serializable(identifier())
	public id = 1;
	@serializable(list(object(Account)))
	@observable public accounts: Account[];
	@serializable(list(object(ScheduledTransaction)))
	@observable public scheduledTransactions: ScheduledTransaction[];

	constructor() {
		this.scheduledTransactions = observable([]);
		this.accounts = observable([]);
		(window as any).store = this;
	}

	public save() {
		setItem('store', serialize(this));
	}
	public findAccount(accountId: number) {
		return this.accounts.find((account) => accountId === account.id);
	}
	@action public saveScheduledTransaction(newScheduledTransaction: ScheduledTransaction) {
		if(!newScheduledTransaction.id) {
			newScheduledTransaction.id = Date.now();
			this.scheduledTransactions.push(newScheduledTransaction);
		} else {
			const index = this.scheduledTransactions.findIndex(
				(scheduledTransaction) => scheduledTransaction.id === newScheduledTransaction.id
			);
			this.scheduledTransactions[index] = newScheduledTransaction;
		}
		this.save();
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
	@action public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		(this.scheduledTransactions as any).remove(scheduledTransaction);
		this.save();
	}

	@action public removeAccount(account: Account) {
		(this.accounts as any).remove(account);
		this.save();
	}
	public findScheduledTransaction(id: number) {
		return this.scheduledTransactions.find((scheduledTransaction) => scheduledTransaction.id === id);
	}
};
