import React, { useState } from 'react';
import {
	Collection,
	Account,
	Transaction,
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
	IonListHeader,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { TransactionItem } from '@components/transaction-item';
import { saveDoc, getBatch, getDocRef } from '@common/api';
import { useHistory } from 'react-router-dom';
import { startOfDay } from 'date-fns/esm';

export
function AccountsPage() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedPending, setSelectedPending] = useState<string[]>([]);
	const pendingTransactions = usePendingTransactionsCollection();
	const history = useHistory();

	async function confirm(transaction: Transaction) {
		saveDoc({
			...transaction,
			pending: false,
		}, Collection.Transactions);
	}

	async function confirmAll() {
		const batch = getBatch();

		pendingTransactions.forEach(t => {
			batch.update(getDocRef(`${Collection.Transactions}/${t.id}`), {
				pending: false,
				date: selectedPending.includes(t.id || '') ?
					startOfDay(new Date()).toISOString() :
					t.date,
			});
		});

		batch.commit();
		setModalIsOpen(false);
	}

	function edit(t: Transaction) {
		history.push(`/transaction/${t.id}`);
		setModalIsOpen(false);
	}

	function toggleSelected(pendingId: string, pending: boolean) {
		if(pending) {
			setSelectedPending([
				...selectedPending,
				pendingId,
			]);
		} else {
			setSelectedPending([
				...selectedPending
					.filter(id => id !== pendingId),
			]);
		}
	}

	return (
		<>
			<CollectionPage
				collectionType={Collection.Accounts}
				label="Accounts"
				editPath="/account"
				topContent={
					pendingTransactions.length ? (
						<IonButton
							expand="full"
							color="secondary"
							onClick={() => setModalIsOpen(true)}
						>
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
						<IonButtons slot="end">
							<IonButton onClick={confirmAll}>
								Confirm All
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonListHeader>
							Effective today
						</IonListHeader>
						{pendingTransactions.map(t => (
							<IonItemSliding key={t.id}>	
								<IonItemOptions side="start" onIonSwipe={() => confirm(t)}>
									<IonItemOption
										expandable
										onClick={() => confirm(t)}
									>
										Confirm
									</IonItemOption>
								</IonItemOptions>
								<IonItem>
									<div className="checkbox-item-container" slot="start">
										<IonCheckbox
											checked={selectedPending.includes(t.id || '')}
											onIonChange={({detail}) => toggleSelected(t.id || '', detail.checked)}
										/>
									</div>
									<TransactionItem
										transaction={t}
										onClick={() => edit(t)}
									/>
								</IonItem>
							</IonItemSliding>
						))}
					</IonList>
				</IonContent>
			</IonModal>
		</>
	);
}

export default AccountsPage;
