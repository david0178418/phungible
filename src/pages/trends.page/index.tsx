import React, { useState, useEffect, useContext } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButton,
	IonMenuButton,
	IonSegment,
	IonSegmentButton,
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
	IonList,
	IonButtons,
	IonModal,
	IonIcon,
	IonFabButton,
	IonFab,
} from '@ionic/react';
import { format, parse, sub, startOfDay } from 'date-fns';
import { Colors, TransactionType, Transaction, Collection } from '@shared/interfaces';
import { getTransactionsInDateRage, saveDoc } from '@common/api';
import {
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
	BarChart,
	Bar,
} from 'recharts';
import { moneyFormat } from '@shared/utils';

import './trends.page.scss';
import { ProfileContext } from '@common/contexts';
import { TransactionItem } from '@components/transaction-item';
import { useEditItem } from '@common/hooks';
import { canSaveTransaction } from '@common/validations';
import { close, checkmark } from 'ionicons/icons';
import { TransactionEditForm } from '@components/transaction-edit-form';

enum Tabs {
	History = 'history',
	Projection = 'projection',
}

const CategoryColors: any = {
	'Clothing': Colors.Cyan,
	'Debt Payment': Colors.Beige,
	'Entertainment': Colors.Black,
	'Food': Colors.Brown,
	'Health': Colors.Blue,
	'Medical': Colors.Violet,
	'Miscellaneous Extra': Colors.Orange,
	'Miscellaneous Necessities': Colors.Olive,
	'Home': Colors.Fuchsia,
	'Savings/Investment': Colors.Navy,
	'Taxes': Colors.Maroon,
	'Transportation': Colors.Khaki,
	'Utilities': Colors.Indigo,
	'Uncategorized': Colors.Silver,
};

export
function TrendsPage() {
	const [selectedTab, setSeletedTab] = useState<Tabs>(Tabs.History);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [fromDate, setFromDate] = useState(() => startOfDay(sub(new Date(), {months: 1})));
	const [toDate, setToDate] = useState(() => startOfDay(new Date()));
	const [incomeTotal, setIncomeTotal] = useState(0);
	const [expenseTotals, setExpenseTotals] = useState<any[]>([]);
	const profile = useContext(ProfileContext);
	const [
		activeTransaction,
		setActiveTransaction,
		resetActiveTransaction,
		isValid,
	] = useEditItem<Transaction | null>(null, (t) =>
		!!t && canSaveTransaction(t),
	);

	async function update() {
		const ts = await getTransactionsInDateRage(
			fromDate,
			toDate,
			profile?.id || '',
		);

		setTransactions(ts);

		setIncomeTotal(
			ts
				.filter(t => t.type === TransactionType.Income)
				.reduce((total, t) => total + t.amount, 0),
		);
		setExpenseTotals(
			ts
				.filter(t => [
						TransactionType.Expense,
						TransactionType.BudgetedExpense,
					].includes(t.type),
				)
				.reduce((catTotals, current) => {
					const category = current.expenseCategory ?
						current.expenseCategory.label:
						'Uncategorized';
					
					catTotals[category] = catTotals[category] || 0;
					catTotals[category] += current.amount;

					return catTotals;
				}, {} as any),
		);
	}

	useEffect(() => {
		update();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	async function handleSubmit() {
		if(!(isValid && activeTransaction)) {
			return;
		}

		const result = await saveDoc(activeTransaction, Collection.Transactions);

		result && resetActiveTransaction(null);
		update();
	}

	const expenseTotal = Object.values(expenseTotals).reduce((total, val) => total + val, 0);
	const upperBound = incomeTotal > expenseTotal ? incomeTotal : expenseTotal;

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Trends</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<p>
					Work in progress
				</p>
				<IonSegment value={selectedTab}>
					<IonSegmentButton
						value={Tabs.History}
						onClick={() => setSeletedTab(Tabs.History)}
					>
						Breakdown
					</IonSegmentButton>
					<IonSegmentButton
						value={Tabs.Projection}
						onClick={() => setSeletedTab(Tabs.Projection)}
					>
						Projection
					</IonSegmentButton>
				</IonSegment>

				<IonGrid>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position="stacked">
									From
								</IonLabel>
								<IonInput
									type="date"
									value={format(fromDate, 'yyyy-MM-dd')}
									onIonChange={({detail}) =>{
										if(typeof detail.value === 'string') {
											detail.value && setFromDate(parse(detail.value, 'yyyy-MM-dd', new Date()));
										}
									}}
								/>
							</IonItem>
						</IonCol>
						<IonCol>
							<IonItem>
								<IonLabel position="stacked">
									To
								</IonLabel>
								<IonInput
									type="date"
									value={format(toDate, 'yyyy-MM-dd')}
									onIonChange={({detail}) =>{
										if(typeof detail.value === 'string') {
											detail.value && setToDate(parse(detail.value, 'yyyy-MM-dd', new Date()));
										}
									}}
								/>
							</IonItem>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonButton onClick={update} expand="full">
					Update
				</IonButton>
				<p>
					Income Total: ${moneyFormat(incomeTotal)}
				</p>
				<p>
					Expense Total: ${moneyFormat(expenseTotal)}
				</p>
				<div className="graph-container">
					<IonGrid>
						<IonRow>
							<IonCol>
								<ResponsiveContainer width="100%">
									<BarChart
										layout="vertical"
										data={[{
											name: 'Income',
											Amount: incomeTotal,
										}]}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											domain={[0, upperBound]}
											type="number"
											tickFormatter={val => `$${moneyFormat(val)}`}
										/>
										<YAxis
											dataKey="name"
											hide
											type="category"
										/>
										<Tooltip
											formatter={val => `$${moneyFormat(val as number)}`}
											wrapperStyle={{
												zIndex: 1000,
											}}
											labelStyle={{
												fontWeight: 'bold',
											}}
										/>
										<Bar
											dataKey="Amount"
											fill={Colors.Green}
										/>
									</BarChart>
								</ResponsiveContainer>
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol>
								<ResponsiveContainer width="100%">
									<BarChart
										layout="vertical"
										data={[{
											name: `Expenses $${moneyFormat(expenseTotal)}`,
											...expenseTotals,
										}]}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											type="number"
											tickFormatter={val => `$${moneyFormat(val)}`}
											domain={[0, upperBound]}
										/>
										<YAxis
											dataKey="name"
											hide
											type="category"
										/>
										<Tooltip
											formatter={val => `$${moneyFormat(val as number)}`}
											wrapperStyle={{
												zIndex: 1000,
											}}
											labelStyle={{
												fontWeight: 'bold',
											}}
										/>
										{Object.keys(expenseTotals)
											.sort((a: any, b: any) => expenseTotals[b] - expenseTotals[a])
											.map(e => (
												<Bar
													stackId="a"
													key={e}
													dataKey={e}
													fill={CategoryColors[e]}
												/>
											))}
									</BarChart>
								</ResponsiveContainer>
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol>
								<ResponsiveContainer width="100%">
									<BarChart
										layout="vertical"
										data={[{
											name: 'Cashflow',
											Amount: Math.abs(incomeTotal - expenseTotal),
										}]}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											domain={[0, upperBound]}
											type="number"
											tickFormatter={val => `$${moneyFormat(val)}`}
										/>
										<YAxis
											dataKey="name"
											hide
											type="category"
										/>
										<Tooltip
											formatter={() => `${incomeTotal > expenseTotal ? '' : '-'}$${moneyFormat(Math.abs(incomeTotal - expenseTotal))}`}
											wrapperStyle={{
												zIndex: 1000,
											}}
											labelStyle={{
												fontWeight: 'bold',
											}}
										/>
										<Bar
											dataKey="Amount"
											fill={
												incomeTotal > expenseTotal ?
													Colors.Green :
													Colors.Red
											}
										/>
									</BarChart>
								</ResponsiveContainer>
							</IonCol>
						</IonRow>
					</IonGrid>
				</div>
				<IonList>
					{transactions.map(t => (
						<IonItem button key={t.id} onClick={() => setActiveTransaction(t)}>
							<TransactionItem
								transaction={t}
							/>
						</IonItem>
					))}
				</IonList>
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
			</IonContent>
		</IonPage>
	);
}

export default TrendsPage;
