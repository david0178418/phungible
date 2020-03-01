import React, { useEffect, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonList,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import equal from 'fast-deep-equal';
import { cashOutline, trash } from 'ionicons/icons';
import { EditPage } from '../components/edit-page';
import { createAccount, getDoc } from '../api';
import { Collections, Account } from '../interfaces';

function getErrors(account: Account) {
	return !!(
		account.name
	);
}

export
function AccountEditPage() {
	const [originalAccount, setOriginalAccount] = useState<Account>(createAccount);
	const [account, setAccount] = useState<Account>(createAccount);
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const {
		id = '',
	} = useParams();

	useEffect(() => {
		setHasChanged(!equal(account, originalAccount));
	}, [account, originalAccount]);

	useEffect(() => {
		setIsValid(hasChanged && getErrors(account));
	}, [hasChanged, account]);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Account>(`${Collections.Accounts}/${id}`);
				if(a) {
					setOriginalAccount(a);
					setAccount(a);
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<EditPage
			editing={!!id}
			defaultHref="/accounts"
			canSave={isValid}
		>
			<IonItem>
				<IonLabel position="stacked">
					Name
				</IonLabel>
				<IonInput
					value={account.name}
					onIonChange={({detail}) => {
						detail.value &&
						setAccount({
							...account,
							name: detail.value,
						});
					}}
				/>
			</IonItem>
			<IonItem>
				<IonIcon
					slot="start"
					color="money"
					icon={cashOutline}
				/>
				<IonSelect interface="popover" placeholder="Type">
					<IonSelectOption value="brown">
						Money
					</IonSelectOption>
					<IonSelectOption value="blonde">
						Debt
					</IonSelectOption>
				</IonSelect>
			</IonItem>
			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonInput />
			</IonItem>
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Balance at start of
							</IonLabel>
							<IonInput type="date" />
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked">
								$
							</IonLabel>
							<IonInput type="number"/>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonButton expand="full">
				Add Balance
			</IonButton>
			<IonItem lines="none">
				<IonLabel>
					<p>
						Account Balance History
					</p>
				</IonLabel>
			</IonItem>
			<IonItem lines="none">
				<IonLabel color="danger">
					At least one account balance update required.
				</IonLabel>
			</IonItem>
			<IonList>
				<IonItem>
					<IonLabel>
						$10.00
						<p>
							as of 1/1/2020
						</p>
					</IonLabel>
					<IonButton slot="end" fill="clear">
						<IonIcon slot="icon-only" icon={trash} />
					</IonButton>
				</IonItem>
				<IonItem>
					<IonLabel>
						$10.00
						<p>
							as of 1/1/2020
						</p>
					</IonLabel>
					<IonButton slot="end" fill="clear">
						<IonIcon slot="icon-only" icon={trash} />
					</IonButton>
				</IonItem>
			</IonList>
		</EditPage>
	);
}

export default AccountEditPage;
