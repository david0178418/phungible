import React, { useContext, useState } from 'react';
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
import { UserContext } from '@common/contexts';
import { loadingController } from '@ionic/core';
import { presentToast } from '@common/utils';
import { useHistory } from 'react-router-dom';
import { initUser } from '@common/api';

export
function RegistrationPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const user = useContext(UserContext);
	const isValid = !!(email && password);
	const history = useHistory();

	async function register() {
		const loader = await loadingController.create({});
		await loader.present();

		if(user) {
			const cred = auth.EmailAuthProvider.credential(email, password);
			
			try {
				await user.linkWithCredential(cred);
				await initUser(user);
				history.push('/');
			} catch (e) {
				presentToast(e.message);
			}
		} else {
			try {
				const cred = await  auth().createUserWithEmailAndPassword(email, password);

				cred.user && await initUser(cred.user);
			} catch (e) {
				presentToast(e.message);
			}
		}

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
									<IonIcon icon={logInOutline}/>
									Register
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
												routerLink="/login"
												routerDirection="none"
											>
												<IonIcon icon={logInOutline}/>
												I have an account
											</IonButton>
										</IonButtons>
										<IonButtons slot="end">
											<IonButton
												color="primary"
												disabled={!isValid}
												onClick={register}
											>
												<IonIcon icon={personOutline} />
												Register
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

export default RegistrationPage;
