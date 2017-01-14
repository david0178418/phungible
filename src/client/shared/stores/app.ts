import {action, observable} from 'mobx';
import {deserialize, identifier, list, object, serializable, serialize} from 'serializr';

import {setItem} from '../storage';
import Account from './account';
import BudgetEntry from './budget-entry';

export default
class AppStore {
	@action public static deserialize(data: any) {
		return deserialize(AppStore, data);
	}
	@serializable(identifier())
	public id = 1;
	@serializable(list(object(Account)))
	@observable public accounts: Account[];
	@serializable(list(object(BudgetEntry)))
	@observable public budgetEntries: BudgetEntry[];

	constructor() {
		this.budgetEntries = observable([]);
		this.accounts = observable([]);
		(window as any).store = this;
	}

	public save() {
		setItem('store', serialize(this));
	}
	public findAccount(accountId: number) {
		return this.accounts.find((account) => accountId === account.id);
	}
	@action public saveBudgetEntry(newBudgetEntry: BudgetEntry) {
		if(!newBudgetEntry.id) {
			newBudgetEntry.id = Date.now();
			this.budgetEntries.push(newBudgetEntry);
		} else {
			const index = this.budgetEntries.findIndex((budgetEntry) => budgetEntry.id === newBudgetEntry.id);
			this.budgetEntries[index] = newBudgetEntry;
		}
		this.save();
	}
	@action public saveAccount(newAccount: Account) {
		if(!newAccount.id) {
			newAccount.id = Date.now();
			this.accounts.push(newAccount);
		} else {
			const index = this.accounts.findIndex((budgetEntry) => budgetEntry.id === newAccount.id);
			this.accounts[index] = newAccount;
		}
		this.save();
	}
	@action public removeBudgetEntry(budgetEntry: BudgetEntry) {
		(this.budgetEntries as any).remove(budgetEntry);
		this.save();
	}

	@action public removeAccount(account: Account) {
		(this.accounts as any).remove(account);
		this.save();
	}
	public findBudgetEntry(id: number) {
		return this.budgetEntries.find((budgetEntry) => budgetEntry.id === id);
	}
};
