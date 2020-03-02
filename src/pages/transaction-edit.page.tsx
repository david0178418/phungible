import React, {
} from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { EditPage } from '../components/edit-page';
import { AccountSelector } from '../components/account-selector';

export
function TransactionEditPage() {
	const {
		id = '',
	} = useParams();

	return (
		<EditPage editing={!!id} defaultHref="/transactions" handleSubmit={() => {}}>
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
				</IonRow>
			</IonGrid>

			<IonItem>
				<IonLabel position="stacked">
					Type
				</IonLabel>
				<IonSelect value="transfer">
					<IonSelectOption value="income">
						Income
					</IonSelectOption>
					<IonSelectOption value="transfer">
						Transfer
					</IonSelectOption>
					<IonSelectOption value="expense">
						Expense
					</IonSelectOption>
				</IonSelect>
			</IonItem>


			<AccountSelector />
			
			<AccountSelector />

			<IonItem>
				<IonLabel position="stacked">
					Date
				</IonLabel>
				<IonInput type="date" />
			</IonItem>

			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonInput/>
			</IonItem>

		</EditPage>
	);
}

export default TransactionEditPage;
