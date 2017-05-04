import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Money from '../shared/utils/money';
import Account from './account';
import ScheduledTransaction from './scheduled-transaction';

export
enum TransactionType {
	BudgetedExpense,
	Expense,
	Income,
}

export
interface TransactionEffect {
	accountId: string;
	amount: number;
	date: Date;
}

export default
class Transaction {
	@action public static deserialize(data: any) {
		return deserialize(Transaction, data);
	}
	@action public static clone(originalTransaction: Transaction) {
		return Transaction.deserialize(serialize(originalTransaction));
	}
	@serializable(identifier())
	@observable public id: string;
	@serializable(object(Money))
	public amount: Money;
	@serializable(object(Account))
	@observable public fromAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable(object(Account))
	@observable public towardAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable
	@observable public notes = '';
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public type: TransactionType = TransactionType.Expense;
	@serializable(object(ScheduledTransaction))
	public generatedFrom: ScheduledTransaction | null = null;
	@serializable
	@observable private _dateString: string;

	constructor(params?: Partial<Transaction>) {
		if(params) {
			const amount = params.amount ? params.amount.valCents : 0;
			return Object.assign(this, {
				amount: new Money(amount),
				labels: [],
			}, params);
		} else {
			this.amount = new Money();
			this.labels = [];
			this._dateString = moment().format('MM/DD/YYYY');
		}
	}

	set date(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._dateString = moment(newDate).format('MM/DD/YYYY');
		}
	}
	@computed get date() {
		return moment(this._dateString, 'MM/DD/YYYY').toDate();
	}
	@computed get isValid() {
		const {Expense, Income} = TransactionType;
		return !!(this.name && this.amount.val && (
			this.type === Expense && this.fromAccount ||
			this.type === Income && this.towardAccount
		));
	}

	public affectsAccount(account: Account) {
		return (
			this.fromAccount && (this.fromAccount.id === account.id) ||
			this.towardAccount && (this.towardAccount.id === account.id)
		);
	}

	public affectOnDateRange(from: Date, to: Date): TransactionEffect[] {
		if(this.date > to) {
			return null;
		}

		const affects: TransactionEffect[] = [];

		if(
			this.fromAccount &&
			!moment(this.date).isSame(this.fromAccount.latestBalanceUpdate.date, 'day')
		) {
			affects.push({
				accountId: this.fromAccount.id,
				amount: this.amount.valCents * this.fromAccount.fromBalanceDirection,
				date: this.date,
			});
		}

		if(
			this.towardAccount &&
			!moment(this.date).isSame(this.towardAccount.latestBalanceUpdate.date, 'day')
		) {
			affects.push({
				accountId: this.towardAccount.id,
				amount: this.amount.valCents * this.towardAccount.towardBalanceDirection,
				date: this.date,
			});
		}

		return affects;
	}
}
