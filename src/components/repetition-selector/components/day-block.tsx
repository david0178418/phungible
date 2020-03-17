import React from 'react';
import { IonRippleEffect, IonIcon } from '@ionic/react';
import { checkmark } from 'ionicons/icons';

import '../../../budget-fns';

interface Props {
	label: string;
	checked?: boolean;
	onClick?: () => void;
}

export
function DayBlock(props: Props) {
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
