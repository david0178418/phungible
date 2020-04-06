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
		towardAccountId: '',
		type: TransactionType.Expense,
		parentBudgetId: budget?.id || '',
		parentScheduledTransactionId: '',
	};
}

export
function createProfile(): Profile {
	return {
		name: '',
		ownerId: '',
		notes: '',
		date: new Date().toISOString(),
		sharedUsers: {},
	};
}
