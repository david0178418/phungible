import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Account from './account';

export
enum TransactionType {
	Income,
	Expense,
};

export
enum RepeatUnits {
	Day,
	Week,
	Month,
	Year,
	None,
};

export default
class ScheduledTransaction {
	@action public static deserialize(data: any) {
		return deserialize(ScheduledTransaction, data);
	}
	@action public static clone(originalEntry: ScheduledTransaction) {
		return ScheduledTransaction.deserialize(serialize(originalEntry));
	}
	@serializable(object(Account))
	@observable public fromAccount: Account | null = null;	// TODO Clean up setting and access
	@observable public towardAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable
	@observable public amount = 0;
	@serializable
	@observable public description: string;
	@serializable(list(primitive()))
	@observable public exceptions: string[];
	@serializable(identifier())
	public id: number;
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public repeatUnit: RepeatUnits = RepeatUnits.Week;
	@serializable
	@observable public repeatValue = 1;
	@serializable
	@observable public type: TransactionType = TransactionType.Expense;
	@serializable
	@observable private _startDate: string;

	constructor() {
		this.exceptions = [];
		this.labels = [];
		this._startDate = moment().format('MM/DD/YYYY');
	}
	set startDate(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._startDate = moment(newDate).format('MM/DD/YYYY');
		}
	}
	@computed get startDate() {
		return moment(this._startDate, 'MM/DD/YYYY').toDate();
	}
	@computed get isValid() {
		return !!(this.amount && this.name);
	}
	@computed get prettyAmount() {
		return (this.amount / 100).toFixed(2);
	}
	@computed get repeats() {
		return this.repeatUnit !== RepeatUnits.None;
	}
};
