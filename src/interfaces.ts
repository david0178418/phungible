// import { firestore } from 'firebase/app';

export
type Docs = { id?: string };

export
enum Collections {
	Accounts = 'accounts',
	Budgets = 'budgets',
	RecurringTransactions = 'recurring-transactions',
	Transactions = 'transactions',
	BalanceUpdateHistory = 'balance-update-history',
}

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
