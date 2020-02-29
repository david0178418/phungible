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
function TrendsPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Trends</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Trends Page
			</IonContent>
		</IonPage>
	);
}

export default TrendsPage;
