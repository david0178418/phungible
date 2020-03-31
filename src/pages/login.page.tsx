import React, { useState } from 'react';
import { auth } from 'firebase/app';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonCard,
	IonCardContent,
	IonInput,
	IonItem,
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
	IonCardHeader,
	IonIcon,
	IonFooter,
	IonButtons,
	IonButton,
	IonBackButton,
} from '@ionic/react';
import { logInOutline, personOutline } from 'ionicons/icons';
import { loadingController } from '@ionic/core';
import { presentToast } from '@common/utils';
import { initUser } from '@common/api';
import { useHistory } from 'react-router-dom';

export
function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const isValid = !!(email && password);
	const history = useHistory();

	async function login() {
		const loader = await loadingController.create({});
		await loader.present();

		try {
			const {user} = await  auth().signInWithEmailAndPassword(email, password);
			user && await initUser(user);
		} catch (e) {
			presentToast(e.message);
		}

		history.push('/');

		await loader.dismiss();
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonBackButton defaultHref="/" />
					</IonButtons>
					<IonTitle>
						Phungible
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonGrid fixed>
					<IonRow>
						<IonCol sizeLg="6" offsetLg="3">
							<IonCard>
								<IonCardHeader>
									Login
								</IonCardHeader>
								<IonCardContent>
									<IonItem>
										<IonLabel position="stacked">
											Email
										</IonLabel>
										<IonInput
											value={email}
											onIonChange={(e) => setEmail(e.detail.value || '')}
										/>
									</IonItem>
									<IonItem>
										<IonLabel position="stacked">
											Password
										</IonLabel>
										<IonInput
											type="password"
											value={password}
											onIonChange={(e) => setPassword(e.detail.value || '')}
										/>
									</IonItem>
								</IonCardContent>

								<IonFooter>
									<IonToolbar>
										<IonButtons slot="start">
											<IonButton
												routerLink="/register"
												routerDirection="none"
											>
												<IonIcon icon={personOutline}/>
												Create an account
											</IonButton>
										</IonButtons>
										<IonButtons slot="end">
											<IonButton
												color="primary"
												disabled={!isValid}
												onClick={login}
											>
												<IonIcon icon={logInOutline}/>
												Login
											</IonButton>
										</IonButtons>
									</IonToolbar>
								</IonFooter>
							</IonCard>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
}

export default LoginPage;
