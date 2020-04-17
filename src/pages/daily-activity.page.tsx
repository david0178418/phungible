import React, { useState, useEffect, useContext } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButtons,
	IonMenuButton,
	IonSegment,
	IonSegmentButton,
	IonLabel,
	IonButton,
	IonList,
	IonItem,
	IonDatetime,
	IonSpinner,
	IonModal,
	IonIcon,
	IonFab,
	IonFabButton,
	IonItemOptions,
	IonItemSliding,
	IonItemOption,
} from '@ionic/react';
import { startOfDay, endOfDay } from 'date-fns';
import {
	getCollectionRef,
	saveDoc,
} from '@common/api';
import {
	Collection,
	Transaction,
	Budget,
} from '@shared/interfaces';
import { TransactionItem } from '@components/transaction-item';
import { BudgetItem } from '@components/budget-item';
import { ReceiptUploadButton } from '@components/receipt-upload-button';
import { TransactionEditForm } from '@components/transaction-edit-form';
import { useEditItem } from '@common/hooks';
import { canSaveTransaction } from '@common/validations';
import {
	close,
	checkmark,
	addCircleOutline,
} from 'ionicons/icons';
import { BudgetContext, ProfileContext } from '@common/contexts';
import { createTransaction } from '@shared/create-docs';
import { currentPeriod } from '@common/occurrence-fns';

enum PageTab {
	Budgets = 'budgets',
	Transactions = 'transactions',
}

export
function HomePage() {
	const profile = useContext(ProfileContext);
	const profileId = profile?.id || '';
	const [
		activeTransaction,
		setActiveTransaction,
		resetActiveTransaction,
		isValid,
	] = useEditItem<Transaction | null>(null, (t) => {
		return !!t && canSaveTransaction(t);
	});

	const [selectedTab, setSelectedTab] = useState<PageTab>(PageTab.Budgets);
	const [selectedDate, setSelectedDate] = useState(() => (new Date()).toISOString());
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const [selectedBudgetLoading, setSelectedBudgetLoading] = useState(false);
	const [selectedBudgetTransactions, setSelectedBudgetTransactions] = useState<Transaction[]>([]);
	const budgets = useContext(BudgetContext);
	const currentBudgets = budgets.filter(b => currentPeriod(b).every(period => !!period));


	useEffect(() => {
		refreshPage();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDate, selectedTab]);

	useEffect(() => {
		setSelectedBudgetTransactions([]);

		if(!selectedBudget) {
			return;
		}

		let isMounted = true;

		const [start, end] = currentPeriod(selectedBudget);

		if(!(start && end)) {
			return;
		}

		setSelectedBudgetLoading(true);

		getCollectionRef(Collection.Transactions)
			.where('date', '>=', start)
			.where('date', '<', end)
			.where('parentBudgetId', '==', selectedBudget.id)
			.orderBy('date', 'desc')
			.get()
			.then(collection => {
				if(isMounted) {
					setSelectedBudgetTransactions(collection.docs.map(t => t.data() as Transaction));
					setSelectedBudgetLoading(false);
				}
			});
		
		return () => {
			isMounted = false;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBudget]);

	function createTransactionForSelectedDate(): Transaction {
		return {
			...createTransaction(profileId),
			date: selectedDate,
		};
	}

	async function handleSubmit() {
		if(!(isValid && activeTransaction)) {
			return;
		}

		const result = await saveDoc(activeTransaction, Collection.Transactions);

		result && resetActiveTransaction(null);
		refreshPage();
	}

	async function refreshPage() {
		setLoading(true);

		if(!profile?.id) {
			setTransactions([]);
		} else if(selectedTab === PageTab.Transactions) {
			const collection = await getCollectionRef(Collection.Transactions)
				.where('date', '>=', startOfDay(new Date(selectedDate)).toISOString())
				.where('date', '<=', endOfDay(new Date(selectedDate)).toISOString())
				.where('profileId', '==', profile.id)
				.get();

			setTransactions(collection.docs.map(y => y.data() as Transaction));
		}

		setLoading(false);
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>
						Daily Activity
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonSegment
					color="primary"
					value={selectedTab}
					onIonChange={e => setSelectedTab(e.detail.value as PageTab)}
				>
					<IonSegmentButton value={PageTab.Budgets}>
						<IonLabel>
							Budgets
						</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value={PageTab.Transactions}>
						<IonLabel>
							History
						</IonLabel>
					</IonSegmentButton>
				</IonSegment>
				{(selectedTab === PageTab.Budgets) && (
					<div>
						<p>
							<IonButton expand="full" onClick={() => setActiveTransaction(createTransaction(profileId))}>
								Add Unplanned Expense
							</IonButton>
						</p>
						<IonList>
							<IonItem lines="none">
								<IonLabel>
									<p>Remaining Budgeted Amounts</p>
								</IonLabel>
							</IonItem>
							{loading && (
								<IonItem>
									<IonSpinner/>
								</IonItem>
							)}
							{!loading && currentBudgets.map(budget => (
								<IonItemSliding key={budget.id}>
									<IonItemOptions side="start">
										<IonItemOption
											color="money"
											onClick={() => setSelectedBudget(budget)}
										>
											Purchases
										</IonItemOption>
									</IonItemOptions>
									<IonItem
										button
										onClick={() => setActiveTransaction(createTransaction(profileId, budget))}
									>
										<BudgetItem budget={budget} />
									</IonItem>
								</IonItemSliding>
							))}
							{!currentBudgets.length && (
								<IonItem
									lines="none"
									routerLink="/budget"
									routerDirection="forward"
								>
									<IonLabel>
										<em>
											Create a budget
										</em>
									</IonLabel>
									<IonIcon slot="end" icon={addCircleOutline} />
								</IonItem>
							)}
						</IonList>
					</div>
				)}

				{(selectedTab === PageTab.Transactions) && (
					<div>
						<p>
							<IonButton expand="full" onClick={() => setActiveTransaction(createTransactionForSelectedDate())}>
								Add Expense
							</IonButton>
						</p>
						<IonList>
							<IonItem lines="none">
								<IonLabel>
									<p>TransactionsFor</p>
								</IonLabel>
								<IonDatetime
									value={selectedDate}
									onIonChange={({detail}) => detail.value && setSelectedDate(detail.value)}
								/>
							</IonItem>
							{loading && (
								<IonItem>
									<IonSpinner/>
								</IonItem>
							)}
							{!loading && transactions.map(transaction => (
								<IonItem
									button
									key={transaction.id}
									onClick={() => resetActiveTransaction(transaction)}
								>
									<TransactionItem
										transaction={transaction}
									/>
								</IonItem>
							))}
						</IonList>
					</div>
				)}
				<IonFab
					vertical="bottom"
					horizontal="end"
					slot="fixed"
				>
					<ReceiptUploadButton />
				</IonFab>
			</IonContent>
			<IonModal isOpen={!!activeTransaction}>
				{activeTransaction &&  (
					<>
						<IonHeader>
							<IonToolbar color="primary">
								<IonButtons slot="start">
									<IonButton onClick={() => resetActiveTransaction(null)}>
										<IonIcon icon={close}/>
									</IonButton>
								</IonButtons>
								<IonTitle>
									{activeTransaction.id ? activeTransaction.name : 'Add Transaction'}
								</IonTitle>
							</IonToolbar>
						</IonHeader>
						<IonContent>
							<TransactionEditForm
								transaction={activeTransaction}
								onUpdate={(t => setActiveTransaction(t))}
							/>
							<IonFab vertical="bottom" horizontal="end" slot="fixed">
								<IonFabButton
									color="secondary"
									disabled={!isValid}
									onClick={handleSubmit}
								>
									<IonIcon icon={checkmark} />
								</IonFabButton>
							</IonFab>
						</IonContent>
					</>
				)}
			</IonModal>
			<IonModal isOpen={!!selectedBudget}>
				{selectedBudget && (
					<>
						<IonHeader>
							<IonToolbar color="primary">
								<IonButtons slot="start">
									<IonButton onClick={() => setSelectedBudget(null)}>
										<IonIcon icon={close}/>
									</IonButton>
								</IonButtons>
								<IonTitle>
									{selectedBudget.name} Transactions
								</IonTitle>
							</IonToolbar>
						</IonHeader>
						<IonContent>
							{!selectedBudgetLoading && (
								selectedBudgetTransactions.map(t => (
									<IonItem
										key={t.id}
										routerLink={`/transaction/${t.id}`}
										routerDirection="forward"
										onClick={() => setSelectedBudget(null)}
									>
										<TransactionItem transaction={t} />
									</IonItem>
								))
							)}
						</IonContent>
					</>
				)}
			</IonModal>
		</IonPage>
	);
}

export default HomePage;
