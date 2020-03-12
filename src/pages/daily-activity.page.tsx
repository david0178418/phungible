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
	IonGrid,
	IonRow,
	IonCol,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonTextarea,
	IonDatetime,
	IonSpinner,
	IonNote,
} from '@ionic/react';
import { startOfDay, endOfDay } from 'date-fns';
import { AccountSelector } from '../components/account-selector';
import { TransactionItem } from '../components/transaction-item';
import { Transaction, Collection, Budget } from '../interfaces';
import { getCollectionRef, getCollection } from '../api';
import { moneyFormat } from '../utils';

enum PageTab {
	Budgets = 'budgets',
	Transactions = 'transactions',
}

export
function HomePage() {
	const [selectedTab, setSelectedTab] = useState<PageTab>(PageTab.Budgets);
	const [showExpense, setShowExpense] = useState(false);
	const [showQuickExpense, setShowQuickExpense] = useState(false);
	const [selectedDate, setSelectedDate] = useState(() => (new Date()).toISOString());
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
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
						{showExpense && (
							<>
								<IonGrid>
									<IonRow>
										<IonCol>
											<IonItem>
												<IonLabel position="stacked">
													Label
												</IonLabel>
												<IonInput/>
											</IonItem>
										</IonCol>
										<IonCol size="3">
											<IonItem>
												<IonLabel position="stacked">
													$
												</IonLabel>
												<IonInput type="number"/>
											</IonItem>
										</IonCol>
									</IonRow>
								</IonGrid>

								<AccountSelector
									label="From Account"
									value=""
									onChange={() => null}
								/>

								<IonItem>
									<IonLabel position="stacked">Notes</IonLabel>
									<IonTextarea />
								</IonItem>
							</>
						)}
						<p>
							<IonButton expand="full" onClick={() => setShowExpense(!showExpense)}>
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
								<IonItem key={budget.id} routerLink={`/budget/${budget.id}`}>
									<div slot="start" color={budget.amount > 0 ? 'money' : 'debt'}>
										${moneyFormat(budget.amount)}
									</div>
									<div>
										<IonLabel>
											{budget.name}
											<p>
												Renews Feb 20, 2021
											</p>
										</IonLabel>
										<IonNote>
											<em>
												$X.XX Currently Remaining
											</em>
										</IonNote>
									</div>
								</IonItem>
							))}
						</IonList>
					</div>
				)}

				{(selectedTab === PageTab.Transactions) && (
					<div>
						{showQuickExpense && (
							<>
								<IonGrid>
									<IonRow>
										<IonCol>
											<IonItem>
												<IonLabel position="stacked">
													Label
												</IonLabel>
												<IonInput/>
											</IonItem>
										</IonCol>
										<IonCol size="3">
											<IonItem>
												<IonLabel position="stacked">
													$
												</IonLabel>
												<IonInput type="number"/>
											</IonItem>
										</IonCol>
									</IonRow>
								</IonGrid>
								<IonItem>
									<IonLabel position="stacked">From Account</IonLabel>
									<IonSelect value="">
										<IonSelectOption value="">None</IonSelectOption>
										<IonSelectOption value="m">My Acount</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel position="stacked">Notes</IonLabel>
									<IonTextarea />
								</IonItem>
							</>
						)}
						<p>
							<IonButton expand="full" onClick={() => setShowQuickExpense(!showQuickExpense)}>
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
			</IonContent>
		</IonPage>
	);
}

export default HomePage;
