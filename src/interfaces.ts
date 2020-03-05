// import { firestore } from 'firebase/app';

export
type Docs = { id?: string };

export
enum Collection {
	Accounts = 'accounts',
	Budgets = 'budgets',
	RecurringTransactions = 'recurring-transactions',
	Transactions = 'transactions',
	BalanceUpdateHistory = 'balance-update-history',
}

export
type CollectionType = Account | Budget;

export
enum AccountType {
	Debt = 'debt',
	Savings = 'savings',
}

export
enum Unit {
	Dollars = 'dollars',
	Cents = 'cents',
}

export
interface Money {
	unit: Unit;
	totalValCents: number;
}

export
interface Label {
	id?: string;
	name: string;
}

export
interface BalanceUpdateHistoryItem {
	id?: string;
	balance: number;
	date: string;
}

export
interface Account {
	id?: string;
	notes : string;
	labels: Label[];
	name: string;
	type: AccountType;
	profileId: string;
	ownerId: string;
	balanceUpdateHistory: BalanceUpdateHistoryItem[];
}

export
enum RepeatTypes {
	Days,
	Dates,
	Interval,
}

export
enum RepeatDays {
	Su,
	Mo,
	Tu,
	We,
	Th,
	Fr,
	Sa,
}

export
enum RepeatUnits {
	Day,
	Week,
	Month,
	Year,
	None,
}

export
enum TransactionType {
	BudgetedExpense = 'budget',
	Expense =  'expense',
	Income = 'income',
	TransferPayment = 'transfer',
}

export
interface Budget {
	// today: Date;
	amount: number;
	exceptions: string[];
	fromAccountId: string | null;
	id?: string;
	labels: Label[];
	name: string;
	notes: string;
	ownerId: string;
	profileId: string;
	repeatType: RepeatTypes;
	repeatUnit: RepeatUnits;
	repeatValues: number[];
	startDate: string;
	towardAccountId: string | null;
	transactionType: TransactionType;
}