import React, { useContext } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonText,
	IonButton,
} from '@ionic/react';
import { UserContext } from '@common/contexts';

export
function WelcomePage() {
	const user = useContext(UserContext);

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
							fill="clear"
							expand="full"
							routerLink="/getting-started"
							routerDirection="forward"
						>
							Let's get started!
						</IonButton>
						{!user && (
							<IonButton
								fill="clear"
								expand="full"
								routerLink="/register"
								routerDirection="forward"
							>
								Register
							</IonButton>
						)}
						{!user?.email  && (
							<IonButton
								fill="clear"
								expand="full"
								routerLink="/login"
								routerDirection="forward"
							>
								Login
							</IonButton>
						)}
					</p>
					{!!user?.displayName  && (
						<p>
							Signed in as: {user.displayName}
						</p>
					)}
					{!!user?.email  && (
						<p>
							Email: {user.email}
						</p>
					)}
				</IonText>
			</IonContent>
		</IonPage>
	);
}

export default WelcomePage;
