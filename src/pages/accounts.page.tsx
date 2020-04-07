import React, { useState } from 'react';
import {
	Collection,
	Account,
} from '@shared/interfaces';
import { CollectionPage } from '@components/collection-page';
import { AccountItem } from '@components/account-item';
import { usePendingTransactionsCollection } from '@common/hooks';
import {
	IonButton,
	IonModal,
	IonHeader,
	IonToolbar,
	IonIcon,
	IonButtons,
	IonTitle,
	IonContent,
	IonList,
	IonItem,
	IonCheckbox,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { TransactionItem } from '@components/transaction-item';

export
function AccountsPage() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const pendingTransactions = usePendingTransactionsCollection();

	return (
		<>
			<CollectionPage
				collectionType={Collection.Accounts}
				label="Accounts"
				editPath="/account"
				topContent={
					pendingTransactions.length ? (
						<IonButton expand="full" color="secondary" onClick={() => setModalIsOpen(true)}>
							View {pendingTransactions.length} pending transactions
						</IonButton>
					) :
					null
				}
				itemRenderFn={(account: Account) => (
					<AccountItem account={account} />
				)}
			/>
			<IonModal isOpen={!!modalIsOpen}>
				<IonHeader>
					<IonToolbar color="primary">
						<IonButtons slot="start">
							<IonButton onClick={() => setModalIsOpen(false)}>
								<IonIcon icon={close}/>
							</IonButton>
						</IonButtons>
						<IonTitle>
							Pending Transactions
						</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						{pendingTransactions.map(t => (
							<IonItem key={t.id}>
								<IonCheckbox slot="start" />
								<TransactionItem
									transaction={t}
								/>
							</IonItem>
						))}
					</IonList>
				</IonContent>
			</IonModal>
		</>
	);
}

export default AccountsPage;
