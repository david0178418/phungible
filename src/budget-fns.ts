import { RRule } from 'rrule';
import {
	RepeatType,
	RepeatUnit,
} from './interfaces';
import { isBefore, formatDistance } from 'date-fns';

(window as any).RRule = RRule;

const RepeatDaysToRRuleDays = [
	RRule.SU,
	RRule.MO,
	RRule.TU,
	RRule.WE,
	RRule.TH,
	RRule.FR,
	RRule.SA,
];

const RepeatUnitToRRuleInterval = {
	[RepeatUnit.None]: null,
	[RepeatUnit.Day]: RRule.DAILY,
	[RepeatUnit.Month]: RRule.MONTHLY,
	[RepeatUnit.Week]: RRule.WEEKLY,
	[RepeatUnit.Year]: RRule.YEARLY,
};

interface RepeatRuleProps {
	date: string;
	repeatType: RepeatType | null;
	repeatValues: number[];
	repeatUnit: RepeatUnit;
}

export
function nextOccurance(repeatRuleProps: RepeatRuleProps) {
	const {
		date,
		repeatType,
		repeatUnit,
		repeatValues,
	} = repeatRuleProps;

	if(repeatType === RepeatType.Dates) {
		return new RRule({
			dtstart: new Date(date),
			freq: RRule.MONTHLY,
			interval: 1,
		})
		.after(new Date())
		.toISOString();
	}


	if(repeatType === RepeatType.Days) {
		return new RRule({
			dtstart: new Date(date),
			freq: RRule.WEEKLY,
			byweekday: repeatValues.map(val => RepeatDaysToRRuleDays[val]),
			interval: 1,
		})
		.after(new Date())
		.toISOString();
	}

	if(repeatType === RepeatType.Interval) {
		const RRuleInterval = RepeatUnitToRRuleInterval[repeatUnit];
		const startDate = new Date(date);

		if(!RRuleInterval) {
			return isBefore(new Date(), startDate) ?
				startDate.toISOString() :
				'';
		}

		return new RRule({
			dtstart: startDate,
			freq: RRuleInterval,
			interval: repeatValues[0],
		})
		.after(new Date())
		.toISOString();
	}

	return '';
}

export
function nextOccuranceText(repeatRuleProps: RepeatRuleProps) {
	const next = nextOccurance(repeatRuleProps);

	if(!next) {
		return 'N/A';
	}

	return formatDistance(new Date(), new Date(next));
}
