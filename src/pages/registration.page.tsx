import React, {
} from 'react';
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

export
function RegistrationPage() {
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
										<IonInput />
									</IonItem>
									<IonItem>
										<IonLabel position="stacked">
											Password
										</IonLabel>
										<IonInput type="password" />
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
											<IonButton color="primary">
												<IonIcon icon={personOutline}/>
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
