import React from 'react';
import { RepeatDays } from '@common/interfaces';
import { DayBlock } from './day-block';

interface Props {
	checkedDays: number[];
	onDayToggle: (dayIndex: number) => void;
}

export
function WeekdaySelector(props: Props) {
	const {
		checkedDays,
		onDayToggle,
	} = props;

	return (
		<div className="day-container">
			{Object.keys(RepeatDays).map((label, i) => (
				<DayBlock
					key={i}
					label={label}
					checked={checkedDays.includes(i)}
					onClick={() => onDayToggle(i)}
				/>
			))}
		</div>
	);
}
