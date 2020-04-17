import React, { useState } from 'react';
import {
	Collection,
	Transaction,
} from '@shared/interfaces';
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

interface Props {
	isOpen: boolean;
	onClose: () => void;
	transactions: Transaction[];
}

export
function PendingTransactionsModal(props: Props) {
	const {
		transactions,
		onClose,
		isOpen,
	} = props;
	const [selectedPending, setSelectedPending] = useState<string[]>([]);
	const history = useHistory();

	async function confirm(transaction: Transaction) {
		saveDoc({
			...transaction,
			pending: false,
		}, Collection.Transactions);
	}

	async function confirmAll() {
		const batch = getBatch();

		transactions.forEach(t => {
			batch.update(getDocRef(`${Collection.Transactions}/${t.id}`), {
				pending: false,
				date: selectedPending.includes(t.id || '') ?
					startOfDay(new Date()).toISOString() :
					t.date,
			});
		});

		batch.commit();
		onClose();
	}

	function edit(t: Transaction) {
		history.push(`/transaction/${t.id}`);
		onClose();
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
		<IonModal isOpen={isOpen}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonButton onClick={onClose}>
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
						Check to make effective today
					</IonListHeader>
					{transactions.map(t => (
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
	);
}
