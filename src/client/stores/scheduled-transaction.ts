import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {Moment} from 'moment';
import {deserialize, identifier, list, object, primitive, serializable, serialize} from 'serializr';

import Money from '../shared/utils/money';
import Account from './account';

export
enum RepeatTypes {
	Days,
	Dates,
	Interval,
}

export
enum RepeatDays {
	Su,
	Mo,
	Tu,
	We,
	Th,
	Fr,
	Sa,
}

export
enum RepeatUnits {
	Day,
	Week,
	Month,
	Year,
	None,
}

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
	@serializable(object(Account))
	@observable public towardAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable(object(Money))
	public amount: Money;
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
	@serializable(list(primitive()))
	@observable public _repeatValues: number[];
	@serializable
	@observable public type: TransactionType = TransactionType.Expense;
	@serializable
	@observable private _repeatType: RepeatTypes = RepeatTypes.Days;
	@serializable
	@observable private _startDate: string;

	constructor() {
		this.exceptions = [];
		this.labels = [];
		this._startDate = moment().format('MM/DD/YYYY');
		this._repeatValues = [];
		this.amount = new Money();
		(window as any).scheduledTransaction = this; // TODO Remove debug
	}

	@computed get recurrence() {
		return RecurTypes.getRecurrence(this._startDate, this._repeatType, this._repeatValues, this.repeatUnit);
	}
	get repeatType() {
		return this._repeatType;
	}
	set repeatType(val: number) {
		// TODO Change implementation to allow changing of repeat type
		// without losing the entered information
		this._repeatValues = [];

		if(val === RepeatTypes.Interval) {
			this._repeatValues.push(1);
		}

		this._repeatType = val;
	}
	get repeatValues() {
		return this._repeatValues.slice(0);
	}
	get startDateString() {
		return this._startDate;
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
		const {Expense, Income} = TransactionType;

		return !!(this.amount && this.name && this._repeatValues.length && (
			this.type === Expense && this.fromAccount ||
			this.type === Income && this.towardAccount
		));
	}
	@computed get repeats() {
		return this.repeatUnit !== RepeatUnits.None;
	}
	@action public addRepeatValue(val: number) {
		this._repeatValues.push(val);
		(this._repeatValues as any).replace(this._repeatValues.sort((a, b) => a - b));
	}
	@action public removeRepeatValue(removeVal: number) {
		(this._repeatValues as any).replace(this._repeatValues.filter((currentVal) => removeVal !== currentVal));
	}
	public affectsAccount(accountId: number) {
		return (
			(this.fromAccount && this.fromAccount.id === accountId) ||
			(this.towardAccount && this.towardAccount.id === accountId)
		);
	}
	public generateTransaction(date: Date) {
		return new Transaction({
			amount: this.amount,
			date,
			fromAccount: this.fromAccount,
			generatedFrom: this,
			name: this.name,
			towardAccount: this.towardAccount,
			type: this.type,
		});
	}
	public occursOn(date: Date | Moment) {
		return this.recurrence.matches(date);
	}
	public occuranceCountInRange(fromDate: Date, toDate: Date) {
		const from = moment(fromDate);
		const to = moment(toDate);
		const rangeSize = to.diff(from, 'days');
		let occurances = 0;

		for(let x = 0; x <= rangeSize; x++) {
			if(this.recurrence.matches(from)) {
				occurances++;
			}
			from.add(1, 'day');
		}

		return occurances;
	}
	public impactInRange(fromDate: Date, toDate: Date) {
		return this.amount.val *
			this.occuranceCountInRange(fromDate, toDate) *
			(this.type === TransactionType.Income ? 1 : -1);
	}
}

export
class ScheduledTransactionPartial {
	public static nextId = 1;
	public id: number;
	@observable public name = '';
	public amount: Money;

	constructor() {
		this.id = ScheduledTransactionPartial.nextId++;
		this.amount = new Money();
	}
}

export
class ScheduledTransactionFacade extends ScheduledTransaction {
	@observable public transactionPartials: ScheduledTransactionPartial[];

	constructor() {
		super();
		this.transactionPartials = [];
		this.addPartial();
	}

	@computed get isValid() {
		const {Expense, Income} = TransactionType;

		return !!(this.transactionsPopulated() && this._repeatValues.length && (
			this.type === Expense && this.fromAccount ||
			this.type === Income && this.towardAccount
		));
	}

	public transactionsPopulated() {
		return this.transactionPartials.every((transaction) => !!transaction.name.trim());
	}

	@action public addPartial() {
		this.transactionPartials.push(new ScheduledTransactionPartial());
	}

	@action public removePartial(id: number) {
		(this.transactionPartials as any).replace(this.transactionPartials.filter((tp) => tp.id !== id));
	}

	public createScheduledTransactions() {
		return this.transactionPartials.map((transaction) => {
			return ScheduledTransaction.deserialize(this.serialize(transaction));
		});
	}
	public serialize(transaction: ScheduledTransactionPartial) {
		return Object.assign({}, serialize(this), {
			amount: transaction.amount,
			name: transaction.name,
		});
	}
}

// Moved to resolve circular dependency issue.
import RecurTypes from '../shared/utils/recur-types';
import Transaction, {TransactionType} from './transaction';
