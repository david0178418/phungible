import React, {
} from 'react';
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
import { cashOutline, trash } from 'ionicons/icons';
import { EditPage } from '../components/edit-page';

export
function AccountEditPage() {
	const {
		id = '',
	} = useParams();

	return (
		<EditPage editing={!!id} defaultHref="/accounts">
			<IonItem>
				<IonLabel position="stacked">
					Name
				</IonLabel>
				<IonInput />
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
