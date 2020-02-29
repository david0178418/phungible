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
	IonFab,
	IonFabButton,
	IonText,
} from '@ionic/react';
import { arrowUp, arrowDown, add } from 'ionicons/icons';

export
function RecurringPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Recurring</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem>
						<IonIcon
							slot="start"
							color="money"
							icon={arrowUp}
						/>
						<div>
							<IonLabel>
								Pay Day
								<p>
									Next: 1 week
								</p>
							</IonLabel>
						</div>
						<IonText color="money" slot="end">
							$500.00
						</IonText>
					</IonItem>
					<IonItem>
						<IonIcon
							slot="start"
							color="debt"
							icon={arrowDown}
						/>
						<div>
							<IonLabel>
								Rent
								<p>
									Next: 3 days
								</p>
							</IonLabel>
						</div>
						<IonText color="debt" slot="end">
							$100.00
						</IonText>
					</IonItem>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink="/recurring-transaction/"
						routerDirection="forward"
					>
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default RecurringPage;
