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
	IonList,
	IonItem,
	IonIcon,
	IonLabel,
	IonNote,
	IonFab,
	IonFabButton,
} from '@ionic/react';
import { cashOutline, card, add } from 'ionicons/icons';

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
					<IonList>
						<IonItem>
							<IonIcon
								slot="start"
								className="money"
								icon={cashOutline}
							/>
							<div>
								<IonLabel>
									Savings
								</IonLabel>
								<IonNote>
									<em>
										$2.00 pending
									</em>
								</IonNote>
							</div>
							<IonLabel slot="end">
								$7.00
							</IonLabel>
						</IonItem>
						<IonItem>
							<IonIcon
								slot="start"
								className="debt"
								icon={card}
							/>
							Credit Card
							<IonLabel slot="end">
								$7.00
							</IonLabel>
						</IonItem>
						<IonItem>
							<IonIcon
								slot="start"
								className="money"
								icon={cashOutline}
							/>
							<div>
								<IonLabel>
									Savings
								</IonLabel>
								<IonNote>
									<em>
										$2.00 pending
									</em>
								</IonNote>
							</div>
							<IonLabel slot="end">
								$7.00
							</IonLabel>
						</IonItem>
					</IonList>
					<IonFab vertical="bottom" horizontal="end" slot="fixed">
						<IonFabButton color="secondary">
							<IonIcon icon={add} />
						</IonFabButton>
					</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default AccountsPage;
