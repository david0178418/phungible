import React, { useState, useEffect, useContext } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonButton,
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
import { Colors, TransactionType, Transaction, ProfileCollection } from '@shared/interfaces';
import { getProfileDocsInRange, saveProfileDoc } from '@common/api';
import {
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
	BarChart,
	Bar,
} from 'recharts';
import { moneyFormat, unique, notNull, generateColors } from '@shared/utils';
import { ProfileContext } from '@common/contexts';
import { TransactionItem } from '@components/transaction-item';
import { useEditItem } from '@common/hooks';
import { canSaveTransaction } from '@common/validations';
import { close, checkmark } from 'ionicons/icons';
import { TransactionEditForm } from '@components/transaction-edit-form';

import './trends-history.scss';

export
function TrendsHistory() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [fromDate, setFromDate] = useState(() => startOfDay(sub(new Date(), {months: 1})));
	const [toDate, setToDate] = useState(() => startOfDay(new Date()));
	const [incomeTotal, setIncomeTotal] = useState(0);
	const [expenseTotals, setExpenseTotals] = useState<any[]>([]);
	const [colors, setColors] = useState<string[]>([]);
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
		const ts = await getProfileDocsInRange<Transaction>(
			fromDate,
			toDate,
			profile?.id || '',
			ProfileCollection.Transactions,
		);
		const x = ts.map(t => t.expenseCategory).filter(notNull);

		setColors(
			generateColors(
				unique(x, 'id').length,
			),
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

		const result = await saveProfileDoc(activeTransaction, ProfileCollection.Transactions);

		result && resetActiveTransaction(null);
		update();
	}

	const expenseTotal = Object.values(expenseTotals).reduce((total, val) => total + val, 0);
	const upperBound = incomeTotal > expenseTotal ? incomeTotal : expenseTotal;

	return (
		<div className="trends-history">
			<p>
				Work in progress
			</p>
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
										.map((e, i) => (
											<Bar
												stackId="a"
												key={e}
												dataKey={e}
												fill={colors[i]}
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
		</div>
	);
}
