import React from 'react';
import { IonRippleEffect, IonIcon } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { RepeatDays } from '../../../interfaces';

interface DayBlockProps {
	label: string;
	checked?: boolean;
	onClick?: () => void;
}

export
function DayBlock(props: DayBlockProps) {
	const {
		label,
		checked = false,
		onClick,
	} = props;
	return (
		<div className="day-block ion-activatable" onClick={onClick}>
			{label}
			<IonIcon
				color="success"
				hidden={!checked}
				icon={checkmark}
			/>
			<IonRippleEffect/>
		</div>
	);
}


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
		<div className="week-block">
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
