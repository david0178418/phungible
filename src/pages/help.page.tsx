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
function HelpPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Help</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Help Page
			</IonContent>
		</IonPage>
	);
}

export default HelpPage;
