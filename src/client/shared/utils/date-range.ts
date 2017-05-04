import * as moment from 'moment';

type DateRangeParam = Date | moment.Moment;

(window as any).dateRange = dateRange;

export default
function dateRange(from: DateRangeParam, to: DateRangeParam) {
	if(from > to) {
		[from, to] = [to, from];
	}

	const fromMoment = moment(from);
	const toMoment = moment(to);
	const diff = toMoment.diff(fromMoment, 'days');
	const dateRange = [];

	for(let x = 0; x <= diff; x++) {
		dateRange.push(fromMoment.clone());
		fromMoment.add(1, 'day');
	}

	return dateRange;
}
