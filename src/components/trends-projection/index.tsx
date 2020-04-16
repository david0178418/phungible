import React, { useState, useEffect, useContext } from 'react';
import {
	IonButton,
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import {
	format,
	parse,
	startOfDay,
	isSameDay,
	add,
	isBefore,
	isAfter,
} from 'date-fns';
import {
	BudgetContext,
	AccountsContext,
	ProfileContext,
} from '@common/contexts';
import {
	RecurringTransaction,
	ProfileCollection,
	Account,
	Budget,
	Transaction,
	AccountType,
	// Account,
	// Budget,
	// Transaction,
	// AccountType,
} from '@shared/interfaces';
import { getProfileDocsInRange, getAccountTransactionsInRange } from '@common/api';
import {
	dateRange,
	notNull,
	last,
} from '@shared/utils';
import { occurrancesInRange, occursOn } from '@common/occurrence-fns';
import { endOfDay } from 'date-fns/esm';

import './trends-projection.scss';

function earliestUnpassedDateInRange(budget: Budget, from: Date, to = from) {
	return occurrancesInRange(budget, from.toISOString(), to.toISOString())?.[0] || null;
}

function occuranceOnOrBeforeDate(budget: Budget, date: Date) {
	return occurrancesInRange(budget, budget.date, endOfDay(date).toISOString())?.[0] || null;
}

interface BarArgs {
	accounts: Account[];
	to: Date;
	transaction: Transaction;
}

function calcTransactionEffects(args: BarArgs): TransactionEffect[] {
	const {
		accounts,
		to,
		transaction,
	} = args;

	if(new Date(transaction.date) > to) {
		return [];
	}

	const effects: TransactionEffect[] = [];

	if(transaction.fromAccountId) {
		const account = findAccount(transaction.fromAccountId, accounts);
		account && effects.push({
			accountId: transaction.fromAccountId,
			amount: transaction.amount * fromBalanceDirection(account.type),
			date: new Date(transaction.date),
		});
	}

	if(transaction.towardAccountId) {
		const account = findAccount(transaction.towardAccountId, accounts);
		account && effects.push({
			accountId: transaction.towardAccountId,
			amount: transaction.amount * towardBalanceDirection(account.type),
			date: new Date(transaction.date),
		});
	}

	return effects;
}

interface TransactionEffect {
	accountId: string;
	amount: number;
	date: Date;
}

interface FooArgs {
	accounts: Account[];
	budgets: Budget[];
	fromDate: Date;
	recurringTransactions: RecurringTransaction[];
	toDate: Date;
	transactions: Transaction[];
}

function foo(args: FooArgs) {
	const {
		accounts,
		budgets,
		fromDate,
		recurringTransactions,
		toDate,
		transactions,
	} = args;
	const projectionRange = dateRange(fromDate, toDate);
	const combinedBudgetsScheduledTransaction = ([] as Array<Budget | RecurringTransaction>).concat(
		budgets,
		recurringTransactions,
	);
	const confirmedTransactions = transactions.filter(t => !t.pending);

	const transactionEffects = confirmedTransactions
		.map((transaction) => calcTransactionEffects({
			transaction,
			accounts,
			to: toDate,
		}))
		.reduce((val, transactionEffectLists) => val.concat(transactionEffectLists), [])
		.filter(notNull);

	const budgetedAmounts = budgets
		.map((budget): TransactionEffect | null => {
			const earliestDate =
				earliestUnpassedDateInRange(budget, projectionRange[0], projectionRange[projectionRange.length - 1]);

			if(!earliestDate) {
				return null;
			}

			const date = occuranceOnOrBeforeDate(budget, new Date(earliestDate));

			if(!date) {
				return null;
			}

			const account = budget.fromAccountId && findAccount(budget.fromAccountId, accounts);

			if(!account) {
				return null;
			}

			return {
				accountId: budget.fromAccountId,
				amount: budget.amount * fromBalanceDirection(account.type),
				date: new Date(date),
			};
		})
		.filter(notNull);

	const budgetAdjustments = budgets
		.map((budget) => {
			const startDate = projectionRange.find((date) => {
				return !!occuranceOnOrBeforeDate(budget, date);
			});

			if(!startDate) {
				return [];
			}

			const range = dateRange(startDate, projectionRange[projectionRange.length - 1]);
			let remainingPeriodTotal = 0;
			return range
				.map((date): TransactionEffect | null => {
					if(!earliestUnpassedDateInRange(budget, date)) {
						return null;
					}

					remainingPeriodTotal = occursOn(budget, date) ? budget.amount : remainingPeriodTotal;

					if(!remainingPeriodTotal) {
						return null;
					}

					const budgetTransactionTotal = confirmedTransactions
						.filter((transaction) => transaction.parentBudgetId === budget.id)
						.filter((transaction) => isSameDay(new Date(transaction.date), date))
						.reduce((sum, transaction) => sum + transaction.amount, 0);

					if(budgetTransactionTotal && remainingPeriodTotal > 0) {
						const account = budget.fromAccountId && findAccount(budget.fromAccountId, accounts);

						if(!account) {
							return null;
						}

						let amount = budgetTransactionTotal * fromBalanceDirection(account.type);

						if(remainingPeriodTotal < -amount) {
							amount = -remainingPeriodTotal;
							remainingPeriodTotal = 0;
						}

						return {
							accountId: budget.fromAccountId,
							amount: -amount,
							date,
						};
					}

					return null;
				})
				.filter(notNull);
		})
		.flat()
		.filter(notNull);

	const budgetLeadingEdgeRollup = budgets
		.map((budget) => {
			const x = budgetAdjustments
				.filter((budgetedEffect) => budgetedEffect.accountId === budget.fromAccountId)
				.filter((budgetedEffect) => !isBefore(projectionRange[0], endOfDay(budgetedEffect.date)));

			if(!x.length) {
				return null;
			}

			const account = findAccount(budget.fromAccountId, accounts);

			return x.reduce((rollUp, budgetedEffect) => {
					rollUp.amount += budgetedEffect.amount;
					return rollUp;
				}, {
					accountId: budget.fromAccountId,
					amount: budget.amount * (
						account ? fromBalanceDirection(account.type) : 0
					),
					date: projectionRange[0],
				});
		})
		.filter(notNull);

	const pendingScheduledTransactionEffects: TransactionEffect[] = projectionRange
		.filter((date) => isAfter(endOfDay(date), new Date()))
		.map((date) => (
			combinedBudgetsScheduledTransaction
				.filter(notNull)
				.filter((schedTrans) => occursOn(schedTrans, date))
				.map((schedTrans) => {
					const effects = [];

					// if(
					// 	schedTrans.fromAccountId && (
					// 		!isSameDay(date, schedTrans.fromAccount.latestBalanceUpdate.date, 'day') ||
					// 		!schedTrans.occursOn(schedTrans.fromAccount.latestBalanceUpdate.date)
					// 	)
					// ) {
					if(schedTrans.fromAccountId) {
						const fromAccount = findAccount(schedTrans.fromAccountId, accounts);
						const fromLastUpdate = fromAccount?.balanceUpdateHistory[0];

						if(
							fromAccount && fromLastUpdate && (
								!isSameDay(date, new Date(fromLastUpdate.date)) ||
								!occursOn(schedTrans, new Date(fromLastUpdate.date))
							)
						) {
							effects.push({
								accountId: fromAccount.id || '',
								amount: schedTrans.amount * fromBalanceDirection(fromAccount?.type),
								date,
							});
						}
					}

					if((schedTrans as RecurringTransaction).towardAccountId) {
						const towardAccountId = (schedTrans as RecurringTransaction).towardAccountId;
						const towardAccount = findAccount(towardAccountId, accounts);
						const towardLastUpdate = towardAccount?.balanceUpdateHistory[0];

						if (towardAccount && towardLastUpdate && (
								!isSameDay(date, new Date(towardAccount.date)) ||
								!occursOn(schedTrans, new Date(towardLastUpdate.date))
							)
						) {
							effects.push({
								accountId: towardAccount.id || '',
								amount: schedTrans.amount * towardBalanceDirection(towardAccount.type),
								date,
							});
						}
					}

					return effects;
				})
				.reduce((val, effects) => val.concat(effects), [])
		))
		.reduce((val, effects) => val.concat(effects), []);

	const allEffects = []
		.concat(transactionEffects)
		.concat(budgetedAmounts)
		.concat(budgetAdjustments)
		.concat(budgetLeadingEdgeRollup)
		.concat(pendingScheduledTransactionEffects)
		.map((val) => {
			val.date = new Date(val.date);
			return val;
		});

	console.log({
		transactionEffects,
		budgetedAmounts,
		budgetAdjustments,
		budgetLeadingEdgeRollup,
		pendingScheduledTransactionEffects,
	});

	return projectionRange
		.map((date) => {
			const dateBalances: any = {
				dateMoment: date,
			};

			return accounts
				.filter((account) => isAfter(
					startOfDay(date),
					new Date(
						account.balanceUpdateHistory[account.balanceUpdateHistory.length - 1].date,
					),
				))
				.reduce((val, account) => {
					val[account.id || ''] =
						effectsOnAccountDate(account, date, allEffects);
					return val;
				}, dateBalances);
		})
		.map((dataPoint) => {
			const dataPointWithNames = {
				date: format(dataPoint.dateMoment, 'MMM dd'),
			} as any;

			accounts
				.filter((account) => dataPoint[account.id || ''] !== undefined)
				.forEach((account) => {
					dataPointWithNames[account.name] = dataPoint[account.id || ''];
					dataPointWithNames.Total = dataPointWithNames.Total || 0;
					dataPointWithNames.Total += dataPointWithNames[account.name] * globalBalanceDirection(account.type);
				});

			return dataPointWithNames;
		});
}

function findAccount(id: string, accounts: Account[]) {
	return accounts.find(a => a.id === id) || null;
}

function globalBalanceDirection(accountType: AccountType) {
	return accountType === AccountType.Savings ? 1 : -1;
}

function fromBalanceDirection(accountType: AccountType) {
	return accountType === AccountType.Debt ? 1 : -1;
}

function towardBalanceDirection(accountType: AccountType) {
	return accountType === AccountType.Savings ? 1 : -1;
}

function effectsOnAccountDate(account: Account, date: Date, transactionEffects: TransactionEffect[]) {
	const balance = lastBalanceUpdateAsOf(account, date)?.balance || 0;
	const totalChange = transactionEffects
		.filter((transactionEffect) =>
			transactionEffect.accountId === account.id && isAfter(date, transactionEffect.date))
		.map((transactionEffect) => transactionEffect.amount)
		.reduce((val, amount) => val + amount, 0);

	return balance + totalChange;
}

function lastBalanceUpdateAsOf(account: Account, date: Date) {
		return account
			.balanceUpdateHistory
			.find(update =>
				isBefore(new Date(update.date), date),
			) || null;
}

function nextBalanceUpdateAsOf(account: Account, date: Date) {
		return account
			.balanceUpdateHistory
			.find(update =>
				!isBefore(new Date(update.date), date),
			) || null;
}


function getNextRelevantBalanceUpdate(account: Account, date: Date) {
	return lastBalanceUpdateAsOf(account, date) || nextBalanceUpdateAsOf(account, date);
}

interface BalanceOnDateArgs {
	account: Account;
	budgets: Budget[];
	from: Date;
	to: Date;
	recurringTransaction: RecurringTransaction[];
	transactions: Transaction[];
}

function generateBalanceHistory(args: BalanceOnDateArgs) {
	const {
		account,
		budgets,
		to,
		from,
		recurringTransaction,
	} = args;

	const range = dateRange(to, from);

	let cutoff = getNextRelevantBalanceUpdate(account, from);

	const nullDates = range.filter(date => (
		!cutoff || isBefore(new Date(cutoff.date), date)
	));
	const relevantRange = range.filter(date => (
		cutoff && !isBefore(new Date(cutoff.date), date)
	));

	const l = last(relevantRange);
	let transaction = (account.id && cutoff && l) ? 
		await getAccountTransactionsInRange(account.id, cutoff.date, l) :
		[];

	return nullDates.map(date => ({
			balance: null,
			date,
		}))
		.concat(
			relevantRange.map(async (date, i) => ({
				date,
				balance: 0,
			}));
		);
}

// function balanceOnDate(args: BalanceOnDateArgs) {
// 	const {
// 		account,
// 		budgets,
// 		date,
// 		recurringTransaction,
// 		transactions,
// 	} = args;

// 	const lastBalance = balanceUpdateAsOf(account, date);
// 	const adjustments = transactions
// 		.filter(t => isSameDay(new Date(t.date), date))
// 		.map(t => {
// 			let adjustment = 0;

// 			if(t.fromAccountId === account.id) {
// 				adjustment = t.amount * fromBalanceDirection(account.type);
// 			} else if(t.towardAccountId === account.id) {
// 				adjustment = t.amount * towardBalanceDirection(account.type);
// 			}

// 			return {
// 				adjustment,
// 				budgetId: t.parentBudgetId,
// 			};
// 		});

// 	const budgetedAdjustments = budgets
// 		.map(b => {
// 			const spentTotal = adjustments
// 				.filter(a => a.budgetId === b.id)
// 				.reduce((total, a) => total + a.adjustment, 0);
// 			return Math.max(spentTotal, b.amount);
// 		});
// }

export
function TrendsProjection() {
	const [fromDate, setFromDate] = useState(() => startOfDay(new Date()));
	const [toDate, setToDate] = useState(() => startOfDay(add(new Date(), {months: 3})));
	const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
	const profile = useContext(ProfileContext);
	const budgets = useContext(BudgetContext);
	const accounts = useContext(AccountsContext);

	async function update() {
		if(!profile?.id) {
			return;
		}

		const [ t, rt ] = await Promise.all([
			getProfileDocsInRange<Transaction>(fromDate, toDate, profile.id, ProfileCollection.Transactions),
			getProfileDocsInRange<RecurringTransaction>(fromDate, toDate, profile.id, ProfileCollection.RecurringTransactions),
		]);
		console.log(111, t, rt, budgets, accounts, recurringTransactions, setRecurringTransactions);
		
		console.log(222,
			foo({
				accounts,
				budgets,
				transactions: t,
				recurringTransactions: rt,
				fromDate,
				toDate,
			}),
		);
	}

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
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
		</>
	);
}
