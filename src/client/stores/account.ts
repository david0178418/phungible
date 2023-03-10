import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Money from '../shared/utils/money';
import BalanceUpdate from './balance-update';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

export
enum AccountType {
	Debt,
	Savings,
}

export
type ACCOUNT_TYPE = 'account';

export default
class Account {
	public static readonly type: ACCOUNT_TYPE = 'account';
	@action public static deserialize(data: any) {
		return deserialize(Account, data as {});
	}
	@action public static clone(originalEntry: Account) {
		return Account.deserialize(serialize(originalEntry));
	}
	@serializable(identifier())
	@observable public id: string;
	@serializable
	@observable public notes = '';
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public accountType: AccountType = AccountType.Savings;
	@serializable
	public profileId: string;
	@serializable
	public readonly type: ACCOUNT_TYPE = 'account';
	@serializable(list(object(BalanceUpdate)))
	@observable public balanceUpdateHistory: BalanceUpdate[];

	constructor(params: Partial<Account> = {}) {
		Object.assign(this, {
			balanceUpdateHistory: [],
			labels: [],
		}, params);
	}

	public addBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.balanceUpdateHistory.push(balanceUpdate);
		// Keep sorted with oldest balace at 0
		(this.balanceUpdateHistory as any).replace(
			this.balanceUpdateHistory.sort((a, b) => b.date.getTime() - a.date.getTime()),
		);
	}
	public lastBalanceUpdateAsOf(date: Date) {
		const dateMoment = moment(date);
		let lastBalanceUpdate: BalanceUpdate | null = null;
		let returnVal;

		lastBalanceUpdate = this.balanceUpdateHistory
			.filter((balanceUpdate) => dateMoment.isSameOrAfter(balanceUpdate.date, 'day'))
			.reduce((a, b) => a && a.moment.isAfter(b.date) ? a : b, null);

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
		return this.balanceUpdateHistory[this.balanceUpdateHistory.length - 1] || null;
	}
	@computed get latestBalanceUpdate() {
		return this.balanceUpdateHistory[0] || null;
	}
	@computed get isValid() {
		return !!(this.name && this.balanceUpdateHistory.length);
	}
	@computed get fromBalanceDirection() {
		return this.accountType === AccountType.Debt ? 1 : -1;
	}
	@computed get globalBalanceDirection() {
		return this.accountType === AccountType.Savings ? 1 : -1;
	}
	@computed get towardBalanceDirection() {
		return this.accountType === AccountType.Savings ? 1 : -1;
	}

	public applyTransactions(transactions: Transaction[], date: Date) {
		const lastBalanceUpdate = this.lastBalanceUpdateAsOf(date);
		const {Debt, Savings} = AccountType;
		let total = lastBalanceUpdate.amount.valCents;

		transactions.forEach((transaction) => {
			const transactionDate = moment(transaction.date);

			if(lastBalanceUpdate.date.isSameOrBefore(transactionDate, 'days') && transactionDate.isSameOrBefore(date, 'days')) {
				if(transaction.fromAccount && transaction.fromAccount.id === this.id) {
					total += transaction.amount.valCents * (this.accountType === Debt ? 1 : -1);
				} else if(transaction.towardAccount && transaction.towardAccount.id === this.id) {
					total += transaction.amount.valCents * (this.accountType === Savings ? 1 : -1);
				}}
		});

		return new Money(total);
	}
	public changeOnDate(scheduledTransactions: ScheduledTransaction[], date: Date) {
		let change = 0;

		scheduledTransactions.forEach((schedTrans) => {
			if(schedTrans.occursOn(date)) {
				if(schedTrans.fromAccount && this.id === schedTrans.fromAccount.id) {
					change -= schedTrans.amount.valCents;
				} else if(schedTrans.towardAccount && this.id === schedTrans.towardAccount.id) {
					change += schedTrans.amount.valCents;
				}
			}
		});
		return change;
	}

	public serialize() {
		return serialize(this);
	}
}
