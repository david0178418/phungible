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
							className="money"
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
						<div className="money" slot="end">
							$500.00
						</div>
					</IonItem>
					<IonItem>
						<IonIcon
							slot="start"
							className="debt"
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
						<div className="debt" slot="end">
							$100.00
						</div>
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

export default RecurringPage;
