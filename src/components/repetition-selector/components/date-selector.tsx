import React from 'react';
import { DayBlock } from './day-block';
import { range } from '@shared/utils';

const Dates = range(1, 31);

interface Props {
	checkedDays: number[];
	onDateToggle: (dayIndex: number) => void;
}

export
function DateSelector(props: Props) {
	const {
		checkedDays,
		onDateToggle,
	} = props;

	return (
		<div className="day-container">
			{Dates.map((date) => (
				<DayBlock
					key={date}
					label={`${date}`}
					checked={checkedDays.includes(date)}
					onClick={() => onDateToggle(date)}
				/>
			))}
		</div>
	);
}
