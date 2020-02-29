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
function WelcomePage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Welcome</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Welcome Page
			</IonContent>
		</IonPage>
	);
}

export default WelcomePage;
