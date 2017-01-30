import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Money from '../utils/money';
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
	@action public static clone(originalEntry: Account) {
		return Account.deserialize(serialize(originalEntry));
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

	constructor() {
		this.labels = [];
		this.balanceHistory = [];
	}

	public addBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.balanceHistory.push(balanceUpdate);
	}
	public lastBalanceUpdate(date: Date) {
		const dateMoment = moment(date);
		let lastBalanceUpdate: BalanceUpdate;
		let returnVal;

		this.balanceHistory.find((balanceUpdate) => {
			if(balanceUpdate.date < date || dateMoment.isSame(balanceUpdate.date, 'd')) {
				lastBalanceUpdate = balanceUpdate;
			} else {
				return false;
			}
		});

		if(!lastBalanceUpdate) {
			returnVal = {
				amount: new Money(),
				date: moment(),
			};
		} else {
			returnVal = {
				amount: new Money(lastBalanceUpdate.balance.valCents),
				date: moment(lastBalanceUpdate.date),
			};
		}

		return returnVal;
	}
	public removeBalanceUpdate(balanceUpdate: BalanceUpdate) {
		(this.balanceHistory as any).remove(balanceUpdate);
	}
	public projectedBalance(date: string) {
		// TODO
		return this.latestBalanceUpdate;
	}
	get firstBalanceUpdate() {
		return this.balanceHistory[0];
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
		return this.balanceHistory[0] && this.balanceHistory[0].balance.val;
	}
	@computed get isValid() {
		return !!(this.name && this.balanceHistory.length);
	}
}
