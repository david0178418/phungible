import React, { useState } from 'react';
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
} from '@ionic/react';

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
							<IonItem onClick={() => console.log(111)}>
								<IonLabel>
									Foo
									<p>
										Renews Feb 20, 2021
									</p>
								</IonLabel>
								<div className="money" slot="end">
									$100
								</div>
							</IonItem>
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
							<IonItem onClick={() => console.log(111)}>
								<IonLabel>
									Foo
									<p>
										Renews Feb 20, 2021
									</p>
								</IonLabel>
								<div className="money" slot="end">
									$100
								</div>
							</IonItem>
						</IonList>
					</div>
				)}
			</IonContent>
		</IonPage>
	);
}

export default HomePage;
