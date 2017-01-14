import {computed, observable} from 'mobx';
import * as moment from 'moment';
import {serializable} from 'serializr';

export default
class BalanceUpdate {
	@serializable
	@observable public balance = 0;
	@serializable
	@observable private _date: string;

	constructor() {
		this.date = new Date();
	}

	@computed get prettyAmount() {
		return (this.balance / 100).toFixed(2);
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
