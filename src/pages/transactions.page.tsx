import React, {
} from 'react';
import {
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	IonText,
} from '@ionic/react';
import {
	arrowUp,
	add,
	arrowDown,
} from 'ionicons/icons';

export
function TransactionsPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Transactions</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
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
									From: Savings
								</p>
							</IonLabel>
						</div>
						<IonText color="debt" slot="end">
							$500.00
						</IonText>
					</IonItem>
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
									To: Savings
								</p>
							</IonLabel>
						</div>
						<IonText color="money" slot="end">
							$100.00
						</IonText>
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

export default TransactionsPage;
