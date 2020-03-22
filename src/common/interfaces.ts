// import { firestore } from 'firebase/app';

export
type Docs = Account |
	Budget |
	RecurringTransaction |
	Transaction |
	Profile |
	UserMeta;

export
enum Collection {
	Accounts = 'accounts',
	Budgets = 'budgets',
	Profiles = 'profiles',
	RecurringTransactions = 'recurring-transactions',
	Transactions = 'transactions',
	UserMetas = 'user-metas',
}

export
type CollectionPageType = Account |
	Budget |
	RecurringTransaction |
	Transaction |
	Profile;

export
interface UserMeta {
	id: string;
	userId: string;
	currentProfileId: string;
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
interface Profile {
	date: string;
	id?: string;
	name: string;
	notes: string;
	ownerId: string;
	sharedUsers: string[];
}

export
interface Account {
	date: string;
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
	date: string;
	transactionType: TransactionType;
	// Needed??
	// today: Date;
	// towardAccountId: string | null;
}

interface CommonTransaction {
	id?: string;
	profileId: string;
	date: string;
	fromAccountId: string;
	towardAccountId: string;
	amount: number;
	notes: string;
	labels: string[];
	name: string;
	type: TransactionType;
}

export
interface Transaction extends CommonTransaction {
	parentScheduledTransactionId: string;
	parentBudgetId: string;
}

export
// TODO Should transaction be a property?
interface RecurringTransaction extends CommonTransaction {
	exceptions: string[];
	repeatUnit: RepeatUnit;
	repeatValues: number[];
	repeatType: RepeatType | null;
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
	Transfer = 'transfer',
}

export
enum DayOfWeek {
	Sunday
}
