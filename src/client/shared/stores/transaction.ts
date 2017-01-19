import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, primitive, serializable, serialize} from 'serializr';

export
enum TransactionType {
	Expense,
	Income,
};

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
	@serializable
	@observable public amount = 0;
	@serializable
	@observable public notes = '';
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public type: TransactionType = TransactionType.Expense;
	@serializable
	@observable private _dateString: string;

	constructor() {
		this.labels = [];
		this._dateString = moment().format('MM/DD/YYYY');
	}

	set date(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._dateString = moment(newDate).format('MM/DD/YYYY');
		}
	}
	@computed get date() {
		return moment(this._dateString, 'MM/DD/YYYY').toDate();
	}
	@computed get prettyAmount() {
		// TODO
		return (this.amount / 100).toFixed(2);
	}
	@computed get isValid() {
		return !!(this.name && this.amount);
	}
}
