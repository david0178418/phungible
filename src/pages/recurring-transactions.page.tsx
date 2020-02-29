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
function RecurringPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Recurring</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Recurring Page
			</IonContent>
		</IonPage>
	);
}

export default RecurringPage;
