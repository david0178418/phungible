import { RRule } from 'rrule';
import {
	isBefore,
	formatDistance,
	startOfDay,
	endOfDay,
} from 'date-fns';
import {
	RepeatType,
	RepeatUnit,
} from '@shared/interfaces';

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
			dtstart: startOfDay(new Date(date)),
			freq: RRule.MONTHLY,
			bymonthday: repeatValues,
			interval: 1,
		})
		.after(new Date())
		.toISOString();
	}


	if(repeatType === RepeatType.Days) {
		return new RRule({
			dtstart: startOfDay(new Date(date)),
			freq: RRule.WEEKLY,
			byweekday: repeatValues.map(val => RepeatDaysToRRuleDays[val]),
			interval: 1,
		})
		.after(new Date())
		.toISOString();
	}

	if(repeatType === RepeatType.Interval) {
		const RRuleInterval = RepeatUnitToRRuleInterval[repeatUnit];
		const startDate = startOfDay(new Date(date));

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

	if(!(next && repeatRuleProps.repeatValues.length)) {
		return 'N/A';
	}

	return formatDistance(startOfDay(new Date()), new Date(next));
}

export
function previousOccurance(repeatRuleProps: RepeatRuleProps) {
	const {
		date,
		repeatType,
		repeatUnit,
		repeatValues,
	} = repeatRuleProps;

	if(repeatType === RepeatType.Dates) {
		return new RRule({
			dtstart: startOfDay(new Date(date)),
			freq: RRule.MONTHLY,
			bymonthday: repeatValues,
			interval: 1,
		})
		.before(new Date())
		.toISOString();
	}

	if(repeatType === RepeatType.Days) {
		return new RRule({
			dtstart: startOfDay(new Date(date)),
			freq: RRule.WEEKLY,
			byweekday: repeatValues.map(val => RepeatDaysToRRuleDays[val]),
			interval: 1,
		})
		.before(new Date())
		?.toISOString() || '';
	}

	if(repeatType === RepeatType.Interval) {
		const RRuleInterval = RepeatUnitToRRuleInterval[repeatUnit];
		const startDate = startOfDay(new Date(date));

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
		.before(new Date())
		.toISOString();
	}

	return '';
}

export
function currentPeriod(repeatRuleProps: RepeatRuleProps) {
	return [
		previousOccurance(repeatRuleProps),
		nextOccurance(repeatRuleProps),
	];
}

export
function occursOn(repeatRuleProps: RepeatRuleProps, date: Date): boolean {
	return !!occurrancesInRange(
		repeatRuleProps,
		startOfDay(date).toISOString(),
		endOfDay(date).toISOString(),
	).length;
}

export
function occurrancesInRange(repeatRuleProps: RepeatRuleProps, from: string, to: string): string[] {
	const {
		date,
		repeatType,
		repeatUnit,
		repeatValues,
	} = repeatRuleProps;
	let rule: RRule | null = null;

	if(repeatType === RepeatType.Dates) {
		rule = new RRule({
			dtstart: startOfDay(new Date(date)),
			freq: RRule.MONTHLY,
			bymonthday: repeatValues,
			interval: 1,
		});
	}

	if(repeatType === RepeatType.Days) {
		rule = new RRule({
			dtstart: startOfDay(new Date(date)),
			freq: RRule.WEEKLY,
			byweekday: repeatValues.map(val => RepeatDaysToRRuleDays[val]),
			interval: 1,
		});
	}

	if(repeatType === RepeatType.Interval) {
		const RRuleInterval = RepeatUnitToRRuleInterval[repeatUnit];
		const startDate = startOfDay(new Date(date));

		if(!RRuleInterval) {
			return isBefore(new Date(), startDate) ?
				[startDate.toISOString()] :
				[];
		}

		rule = new RRule({
			dtstart: startDate,
			freq: RRuleInterval,
			interval: repeatValues[0],
		});
	}

	return rule
		?.between(new Date(from), new Date(to))
		.map(d => d.toISOString())
		|| [];
}
