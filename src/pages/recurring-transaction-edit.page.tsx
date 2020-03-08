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
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { cashOutline, trash } from 'ionicons/icons';
import { EditPage } from '../components/edit-page';
import { AccountSelector } from '../components/account-selector';
// import { RepetitionSelector } from '../components/repetition-selector';

export
function RecurringTransactionEditPage() {
	const {
		id = '',
	} = useParams();

	return (
		<EditPage editing={!!id} defaultHref="/recurring-transactions" handleSubmit={() => {}}>
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Name
							</IonLabel>
							<IonInput />
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked">
								$
							</IonLabel>
							<IonInput type="number" />
						</IonItem>
					</IonCol>
					<IonCol size="2">
						<IonButton fill="clear">
							<IonIcon slot="icon-only" icon={trash} />
						</IonButton>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Name
							</IonLabel>
							<IonInput />
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked">
								$
							</IonLabel>
							<IonInput type="number" />
						</IonItem>
					</IonCol>
					<IonCol size="2">
						<IonButton fill="clear">
							<IonIcon slot="icon-only" icon={trash} />
						</IonButton>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonButton expand="full">
				Add Another
			</IonButton>
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
			<IonItem>
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput type="date" />
			</IonItem>
			<AccountSelector value="" onChange={() => null} />

			{/* <RepetitionSelector/> */}
		</EditPage>
	);
}

export default RecurringTransactionEditPage;
