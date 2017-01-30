import {computed, observable} from 'mobx';
import * as moment from 'moment';
import {identifier, object, serializable} from 'serializr';

import Money from '../utils/money';

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
}
