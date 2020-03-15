import React, { useState, useEffect } from 'react';
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
} from '@ionic/react';
import { startOfDay, endOfDay } from 'date-fns';
import {
	createTransaction,
	getCollection,
	getCollectionRef,
} from '../api';
import {
	Budget,
	Collection,
	Transaction,
} from '../interfaces';
import { TransactionItem } from '../components/transaction-item';
import { BudgetItem } from '../components/budget-item';
import { close } from 'ionicons/icons';
import { TransactionEditForm } from '../components/transaction-edit-form';

enum PageTab {
	Budgets = 'budgets',
	Transactions = 'transactions',
}

export
function HomePage() {
	const [selectedTab, setSelectedTab] = useState<PageTab>(PageTab.Budgets);
	const [selectedDate, setSelectedDate] = useState(() => (new Date()).toISOString());
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			if(selectedTab === PageTab.Budgets) {
				setBudgets(await getCollection<Budget>(Collection.Budgets));
			}

			if(selectedTab === PageTab.Transactions) {
				const collection = await getCollectionRef(Collection.Transactions)
					.where('date', '>=', startOfDay(new Date(selectedDate)).toISOString())
					.where('date', '<=', endOfDay(new Date(selectedDate)).toISOString())
					.get();
	
				setTransactions(collection.docs.map(y => y.data() as Transaction));
			}

			setLoading(false);
		})();
	}, [selectedDate, selectedTab]);

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
							<IonButton expand="full" onClick={() => setActiveTransaction(createTransaction())}>
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
							{!loading && budgets.map(budget => (
								<IonItem
									key={budget.id}
									onClick={
										() => setActiveTransaction(createTransaction(budget))
									}
								>
									<BudgetItem budget={budget} />
								</IonItem>
							))}
						</IonList>
					</div>
				)}

				{(selectedTab === PageTab.Transactions) && (
					<div>
						<p>
							<IonButton expand="full" onClick={() => setActiveTransaction(createTransaction())}>
								Add Quick Expense
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
								<IonItem key={transaction.id} routerLink={`/transaction/${transaction.id}`}>
									<TransactionItem
										transaction={transaction}
									/>
								</IonItem>
							))}
						</IonList>
					</div>
				)}
				<IonModal isOpen={!!activeTransaction}>
					<IonHeader>
						<IonToolbar color="primary">
							<IonTitle>
								Title
							</IonTitle>
							<IonButtons slot="end">
								<IonButton onClick={() => setActiveTransaction(null)}>
									<IonIcon icon={close}/>
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					{activeTransaction &&  (
						<TransactionEditForm
							transaction={activeTransaction}
							onUpdate={console.log}
						/>
					)}
				</IonModal>
			</IonContent>
		</IonPage>
	);
}

export default HomePage;
