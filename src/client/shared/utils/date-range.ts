import * as moment from 'moment';

type DateRangeParam = Date | moment.Moment;

export default
function dateRange(from: DateRangeParam, to: DateRangeParam) {
	if(from > to) {
		[from, to] = [to, from] as any;
	}

	const fromMoment = moment(from);
	const toMoment = moment(to);
	const diff = toMoment.diff(fromMoment, 'days');
	const range = [];

	for(let x = 0; x <= diff; x++) {
		range.push(fromMoment.clone());
		fromMoment.add(1, 'day');
	}

	return range;
}
