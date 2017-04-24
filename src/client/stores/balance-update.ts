import {computed, observable} from 'mobx';
import * as moment from 'moment';
import {identifier, object, serializable} from 'serializr';

import Money from '../shared/utils/money';

export default
class BalanceUpdate {
	@serializable(identifier())
	public id: number;
	@serializable(object(Money))
	public balance: Money;
	@serializable
	@observable private _date: string;

	constructor() {
		this.id = Date.now();
		this.date = new Date();
		this.balance = new Money();
	}
	@computed get inputFormattedDate() {
		return moment(this._date, 'MM/DD/YYYY').format('YYYY-MM-DD');
	}
	@computed get moment() {
		return moment(new Date(this._date));
	}
	get formattedStartDate() {
		return this._date;
	}
	set date(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._date = moment(newDate).format('MM/DD/YYYY');
		}
	}
	get date() {
		return moment(this._date, 'MM/DD/YYYY').toDate();
	}

	public isBefore(a: moment.Moment) {
		return !this.moment.isBefore(a, 'day');
	}
}
