import {action, computed, observable} from 'mobx';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import BalanceUpdate from './balance-update';

export
enum AccountType {
	Debt,
	Savings,
};


export default
class Account {
	@action public static deserialize(data: any) {
		return deserialize(Account, data);
	}
	@serializable(identifier())
	@observable public id: number;
	@serializable
	@observable public description = '';
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public type: AccountType = AccountType.Savings;
	@serializable(list(object(BalanceUpdate)))
	@observable public balanceHistory: BalanceUpdate[];

	constructor(originalEntry?: Account) {
		if(originalEntry) {
			return Account.deserialize(serialize(originalEntry));
		} else {
			this.labels = [];
			this.balanceHistory = [];
		}
	}

	public addBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.balanceHistory.push(balanceUpdate);
	}

	public removeBalanceUpdate(balanceUpdate: BalanceUpdate) {
		(this.balanceHistory as any).remove(balanceUpdate);
	}

	public projectedBalance(date: string) {
		// TODO
		return this.latestBalanceUpdate;
	}

	@computed get prettyAmount() {
		// TODO
		return (this.todaysBalance / 100).toFixed(2);
	}
	@computed get todaysBalance() {
		// TODO
		return this.projectedBalance('today');
	}
	@computed get latestBalanceUpdate() {
		// TODO - pick out the latest balance
		return this.balanceHistory[0] && this.balanceHistory[0].balance;
	}
	@computed get isValid() {
		return !!(this.name && this.balanceHistory.length);
	}
}
