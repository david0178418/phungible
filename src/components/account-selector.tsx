import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { getCollectionRef } from '../api';
import { Collection, Account } from '../interfaces';

interface Props {
	value: string;
	onChange(id: string): void;
}

export
function AccountSelector(props: Props) {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const {
		value,
		onChange,
	} = props;

	useEffect(() => {
		(async () => {
			const col = await getCollectionRef(Collection.Accounts).get();
			setAccounts(col.docs.map(y => y.data() as Account));
		})();
	}, []);

	return (
		<IonItem>
			<IonLabel position="stacked">From Account</IonLabel>
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