import React from 'react';
import {
	IonPage,
	IonItem,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonIcon,
	IonContent,
	IonLabel,
} from '@ionic/react';
import { peopleOutline, walletOutline, repeat } from 'ionicons/icons';

export
function GettingStartedPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Getting Started</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonItem button>
					<IonIcon slot="start" icon={peopleOutline}/>
					<IonLabel>
						Accounts
					</IonLabel>
				</IonItem>
				<IonItem button>
					<IonIcon slot="start" icon={walletOutline}/>
					<IonLabel>
						Budgets
					</IonLabel>
				</IonItem>
				<IonItem button>
					<IonIcon slot="start" icon={repeat}/>
					<IonLabel>
						Recurring Transactions
					</IonLabel>
				</IonItem>
			</IonContent>
		</IonPage>
	);
}

export default GettingStartedPage;
