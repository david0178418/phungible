import React from 'react';
import { IonRippleEffect, IonIcon } from '@ionic/react';
import { checkmark } from 'ionicons/icons';

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
				hidden={checked}
				icon={checkmark}
			/>
			<IonRippleEffect/>
		</div>
	);
}

export
function WeekdaySelector() {
	return (
		<div className="week-block">
			<DayBlock label="Su"/>
			<DayBlock label="Mo"/>
			<DayBlock label="Tu"/>
			<DayBlock label="We"/>
			<DayBlock label="Th"/>
			<DayBlock label="Fr"/>
			<DayBlock label="Sa"/>
		</div>
	);
}
