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
	IonText,
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
			<IonContent>
				<IonList>

					<IonItemSliding>
						<IonItemOptions side="start">
							<IonItemOption expandable color="danger" onClick={() => console.log(111)}>Delete</IonItemOption>
						</IonItemOptions>
						<IonItem
							routerLink="/account/"
							routerDirection="forward"
						>
							<IonIcon
								slot="start"
								color="money"
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
							<IonText color="green" slot="end">
								$7.00
							</IonText>
						</IonItem>
					</IonItemSliding>
					<IonItem>
						<IonIcon
							slot="start"
							color="debt"
							icon={card}
						/>
						Credit Card
						<IonText color="debt" slot="end">
							$7.00
						</IonText>
					</IonItem>
					<IonItem
						routerLink="/account/"
						routerDirection="forward"
					>
						<IonIcon
							slot="start"
							color="money"
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
						<IonText color="money" slot="end">
							$7.00
						</IonText>
					</IonItem>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink="/account/"
						routerDirection="forward"
					>
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default AccountsPage;
