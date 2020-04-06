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
import { alertController, loadingController } from '@ionic/core';
import { auth } from 'firebase/app';
import { useHistory } from 'react-router-dom';

export
function SettingsPage() {
	const user = useContext(UserContext);
	const { push } = useHistory();

	async function handleSignOut() {
		const loader = await loadingController.create({});
		await loader.present();
		await auth().signOut();
		await loader.dismiss();
		push('/');
	}

	async function handleDeleteUserPrompt() {
		const alert = await alertController.create({
			message: 'Deleting is permanent.  Are you sure?',
			cssClass: 'alert-danger-action',
			buttons: [{
				text: 'Cancel',
				role: 'cancel',
			}, {
				text: 'Delete',
				cssClass: 'alert-danger-action-confirm',
				async handler() {
					const loader = await loadingController.create({});
					await loader.present();
					await user?.delete();
					await loader.dismiss();
					push('/');
				},
			}],
		});

		alert.present();
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
					{user?.email && (
						<p>
							Email: {user?.email} 
						</p>
					)}
				</IonText>
				{!user?.email && (
					<IonButton
						expand="full"
						routerLink="/register"
						routerDirection="forward"
					>
						Register
					</IonButton>
				)}
				{!user?.email && (
					<IonButton expand="full" onClick={handleSignOut}>
						Sign Out
						<IonIcon icon={logOutOutline} />
					</IonButton>
				)}
				<IonList>
					<IonItem routerLink="/getting-started" routerDirection="forward">
						Run Getting Started
					</IonItem>
					<IonItem>
						Version: {config.appVersion}
					</IonItem>
				</IonList>
				<IonButton expand="full" color="danger" onClick={handleDeleteUserPrompt}>
					Delete Account
				</IonButton>
			</IonContent>
		</IonPage>
	);
}

export default SettingsPage;
