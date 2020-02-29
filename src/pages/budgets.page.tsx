import React, {
} from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButtons,
	IonMenuButton,
} from '@ionic/react';

export
function BudgetsPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Budgets</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Budgets Page
			</IonContent>
		</IonPage>
	);
}

export default BudgetsPage;
