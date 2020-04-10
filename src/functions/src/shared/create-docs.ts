import {
	Account,
	AccountType,
	Budget,
	RepeatType,
	RepeatUnit,
	TransactionType,
	RecurringTransaction,
	Transaction,
	Profile,
} from './interfaces';
import { startOfDay } from 'date-fns';
import { filterKeys } from './utils';

export
function createAccount(profileId: string): Account {
	return {
		date: startOfDay(new Date()).toISOString(),
		balanceUpdateHistory: [],
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId,
		type: AccountType.Savings,
	};
}

export
function createBudget(profileId: string): Budget {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId,
		repeatType: RepeatType.Days,
		repeatUnit: RepeatUnit.Week,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		transactionType: TransactionType.BudgetedExpense,
	};
}

export
function createRecurringTransaction(profileId: string): RecurringTransaction {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		profileId,
		repeatType: RepeatType.Dates,
		repeatUnit: RepeatUnit.Month,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		towardAccountId: '',
		type: TransactionType.Income,
	};
}

export
function createTransaction(profileId: string, budget?: Budget): Transaction {
	return {
		amount: 0,
		fromAccountId: budget?.fromAccountId || '',
		labels: [],
		name: budget ? `${budget.name} Expense` : '',
		date: startOfDay(new Date()).toISOString(),
		notes: '',
		profileId,
		receiptUrls: [],
		pending: false,
		towardAccountId: '',
		type: TransactionType.Expense,
		parentBudgetId: budget?.id || '',
		parentScheduledTransactionId: '',
	};
}

export
function createTransactionFromRecurringTransaction(date: string, rt: RecurringTransaction): Transaction {
	return {
		...filterKeys(rt, [
			'exceptions',
			'repeatUnit',
			'repeatValues',
			'repeatType',
		]) as Transaction,
		date,
		name: `${rt.name}`,
		parentScheduledTransactionId: rt.id || '',
		parentBudgetId: '',
	};
}

export
function createProfile(): Profile {
	const date = new Date().toISOString();

	return {
		name: '',
		ownerId: '',
		lastProcessing: date,
		notes: '',
		date,
		sharedUsers: {},
	};
}
