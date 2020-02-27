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
function HomePage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>
						Home Page
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Home Page
			</IonContent>
		</IonPage>
	);
}

export default HomePage;
