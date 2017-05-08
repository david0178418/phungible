import {computed, observable} from 'mobx';
import * as moment from 'moment';
import {identifier, object, serializable} from 'serializr';

import {generateUuid, Money} from '../shared/utils';

export default
class BalanceUpdate {
	@serializable(identifier())
	public id: string;
	@serializable(object(Money))
	public balance: Money;
	@serializable
	@observable private _date: string;

	constructor(params: Partial<BalanceUpdate> = {}) {
		Object.assign(this, {
			balance: new Money(),
			date: new Date(),
			id: generateUuid(),
		}, params);
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
