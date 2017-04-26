import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Money from '../shared/utils/money';
import Account from './account';
import ScheduledTransaction from './scheduled-transaction';

export
enum TransactionType {
	Expense,
	Income,
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
	@observable public id: number;
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
}
