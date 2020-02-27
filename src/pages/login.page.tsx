import React, {
} from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
} from '@ionic/react';

export
function LoginPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
					Login Page
			</IonContent>
		</IonPage>
	);
}

export default LoginPage;
