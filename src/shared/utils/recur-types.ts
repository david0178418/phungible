import * as moment from 'moment';
import 'moment-recur';

export default
class RecurTypes {
	public static getRecurrence(startDate: string, interval: RepeatTypes, values: number[], unit?: RepeatUnits) {
		const recur = (moment(new Date(startDate)) as any).recur();
		const rawValues = (values as any).toJS();

		// TODO Un-uglify if time permits
		switch(interval) {
			case RepeatTypes.Dates:
				return RecurTypes.Dates(recur, rawValues);
			case RepeatTypes.Days:
				return RecurTypes.Days(recur, rawValues);
			case RepeatTypes.Interval:
				return RecurTypes.Interval(recur, values[0], unit);
			default: return null;
		}
	}

	private static Days(recur: any, values: number[]) {
		return recur.every(RecurTypes.daysEnumToString(values)).daysOfWeek();
	}

	private static Dates(recur: any, values: number[]) {
		return recur.every(values).daysOfMonth();
	}

	private static Interval(recur: any, value: number, unit: RepeatUnits) {
		return recur.every(
			value,
			RepeatUnits[unit].toLowerCase(),
		);
	}

	private static daysEnumToString(values: number[]) {
		return values.map((val) => RepeatDays[val]);
	}
}

import {RepeatDays, RepeatTypes, RepeatUnits} from '../../stores/scheduled-transaction';
