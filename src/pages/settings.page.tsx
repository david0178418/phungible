import React, { useContext } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButtons,
	IonMenuButton,
	IonList,
	IonItem,
	IonText,
	IonButton,
	IonIcon,
} from '@ionic/react';
import { config } from '@root/config';
import { UserContext } from '@common/contexts';
import { logOutOutline } from 'ionicons/icons';
import { loadingController } from '@ionic/core';
import { auth } from 'firebase/app';
import { useHistory } from 'react-router-dom';

export
function SettingsPage() {
	const user = useContext(UserContext);
	const { push } = useHistory();

	async function signOut() {
		const loader = await loadingController.create({});
		await loader.present();
		await auth().signOut();
		await loader.dismiss();
		push('/');
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonText>
					<p>
						Signed in as {user?.displayName}
					</p>
					<p>
						Email: {user?.email} 
					</p>
				</IonText>
				<IonButton expand="full" onClick={signOut}>
					Sign Out
					<IonIcon icon={logOutOutline} />
				</IonButton>
				<IonList>
					<IonItem routerLink="/getting-started" routerDirection="forward">
						Run Getting Started
					</IonItem>
					<IonItem>
						Version: {config.appVersion}
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
}

export default SettingsPage;
