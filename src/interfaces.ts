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
enum RepeatType {
	Days = 'days',
	Dates = 'dates',
	Interval = 'interval',
}

export
enum RepeatDays {
	Su = 'Su',
	Mo = 'Mo',
	Tu = 'Tu',
	We = 'We',
	Th = 'Th',
	Fr = 'Fr',
	Sa = 'Sa',
}

export
enum RepeatUnit {
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year',
	None = 'none',
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
	amount: number;
	exceptions: string[];
	fromAccountId: string | null;
	id?: string;
	labels: Label[];
	name: string;
	notes: string;
	ownerId: string;
	profileId: string;
	repeatType: RepeatType | null;
	repeatUnit: RepeatUnit;
	repeatValues: number[];
	startDate: string;
	transactionType: TransactionType;
	// Needed??
	// today: Date;
	// towardAccountId: string | null;
}

export
enum DayOfWeek {
	Sunday
}