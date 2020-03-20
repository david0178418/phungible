import React, { useContext } from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { AccountsContext } from '@common/contexts';

interface Props {
	label: string;
	value: string;
	onChange(id: string): void;
}

export
function AccountSelector(props: Props) {
	const accounts = useContext(AccountsContext);
	const {
		label,
		value,
		onChange,
	} = props;

	return (
		<IonItem>
			<IonLabel position="stacked">{label}</IonLabel>
			<IonSelect value={value} onIonChange={({detail}) => onChange(detail.value)}>
				<IonSelectOption value="">None</IonSelectOption>
				{accounts.map(account => (
					<IonSelectOption
						key={account.id}
						value={account.id}
					>
						{account.name}
					</IonSelectOption>
				))}
			</IonSelect>
		</IonItem>
	);
}
