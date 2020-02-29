import React from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

export
function AccountSelector() {
	return (
		<IonItem>
			<IonLabel position="stacked">From Account</IonLabel>
			<IonSelect value="">
				<IonSelectOption value="">None</IonSelectOption>
				<IonSelectOption value="m">My Acount</IonSelectOption>
			</IonSelect>
		</IonItem>
	);
}