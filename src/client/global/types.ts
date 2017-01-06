import {computed, observable} from 'mobx';
import * as moment from 'moment';

export
class BudgetEntry {
	@observable public amount = 0;
	@observable public exceptions: string[];
	public id: number;
	@observable public labels: string[];
	@observable public name = '';
	@observable public repeatUnit: RepeatUnits = RepeatUnits.None;
	@observable public repeatValue = 1;
	@observable public type: 

	@observable private _startDate: string;

	constructor(originalEntry?: BudgetEntry) {
		if(originalEntry) {
			this.amount = originalEntry.amount;
			this.id = originalEntry.id;
			this.exceptions = originalEntry.exceptions.slice(0);
			this.labels = originalEntry.labels.slice(0);
			this.name = originalEntry.name;
			this.repeatUnit = originalEntry.repeatUnit;
			this.repeatValue = originalEntry.repeatValue;
		} else {
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
		return this.amount && this.name;
	}
	@computed get prettyAmount() {
		return (this.amount / 100).toFixed(2);
	}
	@computed get repeats() {
		return this.repeatUnit !== RepeatUnits.None;
	}
};

export
class AppStore {
	@observable public budgetEntries: BudgetEntry[];
	@observable public openBudgetEntry: BudgetEntry | null = null;

	constructor() {
		this.budgetEntries = observable([]);
	}
};

export
enum RepeatUnits {
	Day,
	Week,
	Month,
	Year,
	None,
};
