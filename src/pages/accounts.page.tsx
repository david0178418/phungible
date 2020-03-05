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
import {
	Collections,
	Account,
	AccountType,
} from '../interfaces';
import { alertController } from '@ionic/core';
import { useCollection } from '../hooks';
import { deleteDoc } from '../api';

export
function AccountsPage() {
	const accountsCollection = useCollection<Account>(Collections.Accounts);

	async function handleDeleteClick(account: Account) {
		const alert = await alertController.create({
			header: `Delete "${account.name}"`,
			message:`Permanently delete "${account.name}"?`,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
				}, {
					text: 'Okay',
					async handler() {
						account.id && await deleteDoc(account.id, Collections.Accounts);
					},
				},
			],
		});

		alert.present();
	}

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
					{accountsCollection.map(account => (
						<IonItemSliding key={account.id}>
							<IonItemOptions side="start">
								<IonItemOption
									expandable
									color="danger"
									onClick={() => handleDeleteClick(account)}
								>
									Delete
								</IonItemOption>
							</IonItemOptions>
							<IonItem
								routerLink={`/account/${account.id}`}
								routerDirection="forward"
							>
								{account.type === AccountType.Savings ? (
									<IonIcon
										slot="start"
										color="money"
										icon={cashOutline}
									/>
								) : (
									<IonIcon
										slot="start"
										color="debt"
										icon={card}
									/>
								)}
								<div>
									<IonLabel>
										{account.name}
									</IonLabel>
									<IonNote>
										<em>
											$X.XX pending
										</em>
									</IonNote>
								</div>
								<IonText
									slot="end"
									color={account.type === AccountType.Savings ? 'money' : 'debt'}
								>
									${account.balanceUpdateHistory[0].balance}
								</IonText>
							</IonItem>
						</IonItemSliding>
					))}
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
