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
	@observable public balanceUpdateHistory: BalanceUpdate[];

	constructor() {
		this.labels = [];
		this.balanceUpdateHistory = [];
	}

	public addBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.balanceUpdateHistory.push(balanceUpdate);
		// Keep sorted with oldest balace at 0
		this.balanceUpdateHistory.sort((a, b) => a.date.getTime() - b.date.getTime());
	}
	public lastBalanceUpdateAsOf(date: Date) {
		const dateMoment = moment(date);
		let lastBalanceUpdate: BalanceUpdate | null = null;
		let returnVal;

		lastBalanceUpdate = this.balanceUpdateHistory.reduce((a, b) => {
			if(!a || !a.isBefore(dateMoment)) {
				// if the first element isn't before the date, none will be
				return a;
			}

			return b.isBefore(dateMoment) ? b : a;
		});

		if(lastBalanceUpdate) {
			returnVal = {
				amount: new Money(lastBalanceUpdate.balance.valCents),
				date: moment(lastBalanceUpdate.date),
			};
		} else {
			returnVal = {
				amount: new Money(),
				date: moment(),
			};
		}

		return returnVal;
	}
	public removeBalanceUpdate(balanceUpdate: BalanceUpdate) {
		(this.balanceUpdateHistory as any).remove(balanceUpdate);
	}
	@computed get firstBalanceUpdate() {
		return this.balanceUpdateHistory[0] || null;
	}
	@computed get latestBalanceUpdate() {
		return this.balanceUpdateHistory[this.balanceUpdateHistory.length - 1] || null;
	}
	@computed get isValid() {
		return !!(this.name && this.balanceUpdateHistory.length);
	}
}
