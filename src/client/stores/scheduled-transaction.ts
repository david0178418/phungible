import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, reference, serializable, serialize} from 'serializr';

import {TransactionType} from '../constants';
import {generateUuid} from '../shared/utils';
import { getAccount } from '../shared/utils/get-data-type';
import Money from '../shared/utils/money';
import Account from './account';

let RecurTypes: any;
let Transaction: any;

type Moment = moment.Moment;
type DateMoment = Date | Moment;

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

type TYPE = 'recurring-transaction';

export default
class ScheduledTransaction {
	public static type: TYPE = 'recurring-transaction';
	public static deserialize(data: any) {
		return new Promise((resolve, reject) => {
			deserialize(ScheduledTransaction, data, (err: any, result: any) => {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
	@action public static clone(originalEntry: ScheduledTransaction) {
		return ScheduledTransaction.deserialize(serialize(originalEntry));
	}
	@serializable(reference(Account, getAccount))
	@observable public fromAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable(reference(Account, getAccount))
	@observable public towardAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable(object(Money))
	public amount: Money;
	@serializable
	@observable public notes: string;
	@serializable(list(primitive()))
	@observable public exceptions: string[];
	@serializable(identifier())
	public id: string;
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable
	@observable public repeatUnit: RepeatUnits = RepeatUnits.Week;
	@serializable(list(primitive()))
	@observable public _repeatValues: number[];
	public today: Date;
	@serializable
	@observable public transactionType: TransactionType = TransactionType.Expense;
	@serializable
	public type: TYPE = 'recurring-transaction';
	@serializable
	@observable private _repeatType: RepeatTypes = RepeatTypes.Days;
	@serializable
	@observable private _startDate: string;

	constructor(params: Partial<ScheduledTransaction> = {}) {
		Object.assign(this, {
			_repeatValues: [],
			amount: new Money(),
			exceptions: [],
			labels: [],
			startDate: moment().toDate(),
			today: moment().toDate(),
		}, params);

		(window as any).scheduledTransaction = this; // TODO Remove debug
	}

	@computed get lastOccurance() {
		const dateMoment = moment(this.today);

		while(true) {
			if(this.occursOn(dateMoment)) {
				return dateMoment.toDate();
			} else if(dateMoment.isSameOrBefore(this.startDate, 'day')) {
				return null;
			}

			dateMoment.subtract(1, 'day');
		}
	}
	@computed get firstOccurance() {
		return this.occuranceOnOrBeforeDate(this.today);
	}
	@computed get nextOccurance() {
		return this.occuranceAfterDate(this.today);
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
		const {Income} = TransactionType;

		return !!(this.name && this._repeatValues.length && (
			this.transactionType !== Income && this.fromAccount ||
			this.transactionType === Income && this.towardAccount
		));
	}
	@computed get repeats() {
		return this.repeatUnit !== RepeatUnits.None;
	}
	@action public addRepeatValue(val: number) {
		this._repeatValues.push(val);
		(this._repeatValues as any).replace(this._repeatValues.sort((a, b) => a - b));
	}
	@action public setRepeatValue(val: number[]) {
		(this._repeatValues as any).replace(val.sort((a, b) => a - b));
	}
	@action public removeRepeatValue(removeVal: number) {
		(this._repeatValues as any).replace(this._repeatValues.filter((currentVal) => removeVal !== currentVal));
	}
	public affectsAccount(accountId: string) {
		return (
			(this.fromAccount && this.fromAccount.id === accountId) ||
			(this.towardAccount && this.towardAccount.id === accountId)
		);
	}
	public generateTransaction(date: Date, needsConfirmation = true) {
		return new Transaction({
			amount: this.amount,
			date,
			fromAccount: this.fromAccount,
			generatedFromSchedTrans: this,
			name: this.name,
			needsConfirmation,
			towardAccount: this.towardAccount,
			transactionType: this.transactionType,
		});
	}
	public earliestUnpassedDateInRange(from: DateMoment, to?: DateMoment) {
		const fromMoment = moment(from);
		to = to || from;
		const toMoment = moment(to);

		while(!fromMoment.isAfter(toMoment, 'day')) {
			if(fromMoment.isSameOrAfter(this.lastOccurance, 'day')) {
				return fromMoment.toDate();
			}
			fromMoment.add(1, 'day');
		}

		return null;
	}
	public occursOn(date: DateMoment) {
		return this.recurrence.matches(date);
	}
	public occuranceCountInRange(fromDate: Date, toDate: Date) {
		return this.occurancesInRange(fromDate, toDate).length;
	}
	public occurancesInRange(fromDate: Date, toDate: Date) {
		const from = moment(fromDate);
		const to = moment(toDate);
		const rangeSize = to.diff(from, 'days');
		const occurances = [];

		for(let x = 0; x <= rangeSize; x++) {
			if(this.recurrence.matches(from)) {
				occurances.push({
					accountId: this.fromAccount.id,
					amount: this.amount.valCents * this.fromAccount.fromBalanceDirection,
					date: from.toDate(),
				});
			}
			from.add(1, 'day');
		}

		return occurances;
	}
	public impactInRange(fromDate: Date, toDate: Date) {
		return this.amount.val *
			this.occuranceCountInRange(fromDate, toDate) *
			(this.transactionType === TransactionType.Income ? 1 : -1);
	}
	public occuranceOnOrBeforeDate(date: Date) {
		const dateMoment = moment(date);

		while(true) {
			if(this.occursOn(dateMoment)) {
				return dateMoment.toDate();
			} else if(dateMoment.isSameOrBefore(this.startDate, 'day')) {
				return null;
			}

			dateMoment.subtract(1, 'day');
		}
	}
	public occuranceAfterDate(date: Date) {
		const dateMoment = moment(this.startDate);
		dateMoment.add(1, 'day');

		while(true) {
			if(this.occursOn(dateMoment)) {
				return dateMoment.toDate();
			}
			dateMoment.add(1, 'day');
		}
	}

	public serialize() {
		return serialize(this);
	}
}

export
class ScheduledTransactionPartial {
	public id: string;
	@observable public name = '';
	public amount: Money;

	constructor() {
		this.id = generateUuid();
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
		const {BudgetedExpense, Expense, Income} = TransactionType;

		return !!(this.transactionsPopulated() && this._repeatValues.length && (
			this.transactionType === Expense && this.fromAccount ||
			this.transactionType === BudgetedExpense && this.fromAccount ||
			this.transactionType === Income && this.towardAccount
		));
	}

	public transactionsPopulated() {
		return this.transactionPartials.every((transaction) => !!transaction.name.trim());
	}

	@action public addPartial() {
		this.transactionPartials.push(new ScheduledTransactionPartial());
	}

	@action public removePartial(id: string) {
		(this.transactionPartials as any).replace(this.transactionPartials.filter((tp) => tp.id !== id));
	}

	public createScheduledTransactions() {
		return Promise.all(
			this.transactionPartials.map((transaction) => {
				return ScheduledTransaction.deserialize({
					...this.serialize(),
					amount: transaction.amount,
					name: transaction.name,
				});
			}),
		);
	}
}

setTimeout(() => {
	// Moved to resolve circular dependency issue
	import('../shared/utils/recur-types')
		.then((m) => {
			RecurTypes = m.default;
		});
	import('./transaction')
		.then((m) => {
			Transaction = m.default;
		});
}, 0);
