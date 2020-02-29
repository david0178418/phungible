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
	IonButton,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { RepetitionSelector } from '../components/repetition-selector';
import { EditPage } from '../components/edit-page';

export
function BudgetEditPage() {
	const {
		id = '',
	} = useParams();

	return (
		<EditPage defaultHref="/budgets" editing={!!id}>
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
							<IonInput type="number"/>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonButton expand="full">
				Add Another
			</IonButton>

			<IonItem>
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput type="date" />
			</IonItem>

			<IonItem>
				<IonLabel position="stacked">
					From
				</IonLabel>
				<IonSelect>
					<IonSelectOption>
						Savings
					</IonSelectOption>
					<IonSelectOption>
						Credit Card
					</IonSelectOption>
				</IonSelect>
			</IonItem>

			<RepetitionSelector />
		</EditPage>
	);
}

export default BudgetEditPage;
