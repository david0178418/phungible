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
	transactionType: TransactionType;
	id?: string;
	profileId: string;
	fromAccountId: string | null;
	towardAccountId: string | null;
	amount: number;
	notes: string;
	exceptions: string[];
	labels: Label[];
	name: string;
	repeatUnit: RepeatUnits;
	repeatValues: number[];
	// today: Date;
	repeatType: RepeatTypes;
	startDate: string;
}