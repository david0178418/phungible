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
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonMenuButton,
	IonNote,
	IonPage,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import {
	cashOutline,
	card,
	add,
} from 'ionicons/icons';
import { useCollection } from '../hooks';
import { Collections } from '../interfaces';

export
function AccountsPage() {
	const accountsCollection = useCollection(Collections.Accounts);

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
					{accountsCollection && (

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
					)}
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
