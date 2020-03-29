import React, {
} from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonText,
	IonButton,
} from '@ionic/react';

export
function WelcomePage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Phungible</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonText>
					<h1>
						Welcome to Phungible
					</h1>
					<p>
						Thank you for using Phungible!
					</p>
					<p>
						Budget planning is hard. Phungible aims to make planning
						easier by allowing you to take control of your financial
						future with a plan you begin <strong>today</strong>.
					</p>
					<p>
						<IonButton
							routerLink="/getting-started"
							routerDirection="forward"
						>
							Let's get started!
						</IonButton>
					</p>
				</IonText>
			</IonContent>
		</IonPage>
	);
}

export default WelcomePage;
