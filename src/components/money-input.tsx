import React from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
} from '@ionic/react';
import { moneyFormat, moneyParse } from '@common/utils';

interface Props {
	amount: number;
	onUpdate(newAmount: number): void;
}

export
function MoneyInput(props: Props) {
	const {
		amount,
		onUpdate,
	} = props;
	return (
		<IonItem>
			<IonLabel position="stacked" color="money">
				$
			</IonLabel>
			<IonInput
				type="number"
				value={moneyFormat(amount)}
				onIonChange={({detail}) => {
					if(typeof detail.value === 'string') {
						onUpdate(moneyParse(+detail.value));
					}
				}}
			/>
		</IonItem>
	);
}
