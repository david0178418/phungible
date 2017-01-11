import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, serialize, serializable} from 'serializr';

import {setItem} from './storage';

export
class BudgetEntry {
	@serializable
	@observable public amount = 0;
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
			// TODO use serializr to simplifiy
			this.amount = originalEntry.amount;
			this.id = originalEntry.id;
			this.exceptions = originalEntry.exceptions.slice(0);
			this.labels = originalEntry.labels.slice(0);
			this.name = originalEntry.name;
			this.repeatUnit = originalEntry.repeatUnit;
			this.repeatValue = originalEntry.repeatValue;
			this._startDate = originalEntry._startDate;
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

export
class AppStore {
	@serializable(list(object(BudgetEntry)))
	@observable public budgetEntries: BudgetEntry[];
	@observable public openBudgetEntry: BudgetEntry | null = null;

	constructor() {

		this.budgetEntries = observable([]);
		(window as any).store = this;
	}

	public save() {
		setItem('store', serialize(this));
	}
	@action public saveBudgetEntry(newBudgetEntry: BudgetEntry) {
		if(!newBudgetEntry.id) {
			newBudgetEntry.id = Date.now();
			this.budgetEntries.push(newBudgetEntry);
		} else {
			const index = this.budgetEntries.findIndex(budgetEntry => budgetEntry.id === newBudgetEntry.id);
			this.budgetEntries[index] = newBudgetEntry;
		}
		this.save();
	}
	@action public removeBudgetEntry(budgetEntry: BudgetEntry) {
		(this.budgetEntries as any).remove(budgetEntry);
		this.save();
	}
	@action public static deserialize(data: any) {
		return deserialize(AppStore, data);
	}
	public findBudgetEntry(id: number) {
		return this.budgetEntries.find(budgetEntry => budgetEntry.id === id);
	}
};

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
