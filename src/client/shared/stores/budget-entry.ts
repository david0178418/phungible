import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, primitive, serializable, serialize} from 'serializr';

export
enum BudgetType {
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
class BudgetEntry {
	@action public static deserialize(data: any) {
		return deserialize(BudgetEntry, data);
	}
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
	@observable public repeatUnit: RepeatUnits = RepeatUnits.None;
	@serializable
	@observable public repeatValue = 1;
	@serializable
	@observable public type: BudgetType = BudgetType.Expense;
	@serializable
	@observable private _startDate: string;

	constructor(originalEntry?: BudgetEntry) {
		if(originalEntry) {
			return BudgetEntry.deserialize(serialize(originalEntry));
		} else {
			this.exceptions = [];
			this.labels = [];
			this._startDate = moment().format('MM/DD/YYYY');
		}
	}

	set startDate(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._startDate = moment(newDate).format('MM/DD/YYYY');
		}
	}
	get startDate() {
		return moment(this._startDate, 'MM/DD/YYYY').toDate();
	}
	@computed get formattedStartDate() {
		return this._startDate;
	}
	@computed get inputFormattedDate() {
		return moment(this._startDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
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
