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
function AccountsPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Accounts</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Accounts Page
			</IonContent>
		</IonPage>
	);
}

export default AccountsPage;
