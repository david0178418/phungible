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
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
} from '@ionic/react';
import { add } from 'ionicons/icons';

export
function BudgetsPage() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Budgets</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonList>
					<IonItemSliding>
						<IonItemOptions side="start">
							<IonItemOption expandable color="danger" onClick={() => console.log(111)}>Delete</IonItemOption>
						</IonItemOptions>
						<IonItem
							routerLink="/budget/some-id"
							routerDirection="forward"
						>
							<div slot="start">
								$7.00
							</div>
							<div>
								<IonLabel>
									Coffee
								</IonLabel>
								<IonNote>
									<em>
										$2.00 Currently Remaining
									</em>
								</IonNote>
							</div>
						</IonItem>
					</IonItemSliding>
					<IonItem>
						<div slot="start">
							$20.00
						</div>
						<div>
							<IonLabel>
								Eating Out
							</IonLabel>
							<IonNote>
								<em>
									$10.00 Currently Remaining
								</em>
							</IonNote>
						</div>
					</IonItem>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink="/budget/"
						routerDirection="forward"
					>
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default BudgetsPage;
