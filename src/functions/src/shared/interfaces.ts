declare var process : {
	env: {
		NODE_ENV: string
	}
};

declare global {
	interface Array<T> {
		concat<U>(...items: (U | ConcatArray<U>)[]): (T | U)[]
	}
}

export
enum Constants {
	SandardDateFormat = 'yyyy-MM-dd',
}

export
type ProfileDocs = Account |
	Budget |
	RecurringTransaction |
	Transaction;

export
type Docs = ProfileDocs |
	Profile |
	UserMeta;

export
enum ProfileCollection {
	Accounts = 'accounts',
	Budgets = 'budgets',
	RecurringTransactions = 'recurring-transactions',
	Transactions = 'transactions',
}

export
enum Collection {
	Accounts = 'accounts',
	Budgets = 'budgets',
	Profiles = 'profiles',
	RecurringTransactions = 'recurring-transactions',
	Transactions = 'transactions',
	UserMetas = 'user-metas',
	Usernames = 'usernames',
}

export
interface ExpenseCategory {
	id: string;
	label: string;
}

export
const ExpenseCategories: ExpenseCategory[] = [
	{
		id: 'clothing',
		label: 'Clothing',
	}, {
		id: 'debt-payment',
		label: 'Debt Payment',
	}, {
		id: 'entertainment',
		label: 'Entertainment',
	}, {
		id: 'food',
		label: 'Food',
	}, {
		id: 'health',
		label: 'Health',
	}, {
		id: 'medical',
		label: 'Medical',
	}, {
		id: 'miscellaneous-extra',
		label: 'Miscellaneous Extra',
	}, {
		id: 'miscellaneous-necessities',
		label: 'Miscellaneous Necessities',
	}, {
		id: 'home',
		label: 'Home',
	}, {
		id: 'savings',
		label: 'Savings/Investment',
	}, {
		id: 'taxes',
		label: 'Taxes',
	}, {
		id: 'transportation',
		label: 'Transportation',
	}, {
		id: 'utilities',
		label: 'Utilities',
	},
];

export
enum Colors {
	Aqua = '#00ffff',
	Azure = '#f0ffff',
	Beige = '#f5f5dc',
	Black = '#000000',
	Blue = '#0000ff',
	Brown = '#a52a2a',
	Cyan = '#00ffff',
	DarkBlue = '#00008b',
	DarkCyan = '#008b8b',
	DarkGrey = '#a9a9a9',
	DarkGreen = '#006400',
	DarkKhaki = '#bdb76b',
	DarkMagenta = '#8b008b',
	DarkOliveGreen = '#556b2f',
	DarkOrange = '#ff8c00',
	DarkOrchid = '#9932cc',
	DarkRed = '#8b0000',
	DarkSalmon = '#e9967a',
	DarkViolet = '#9400d3',
	Fuchsia = '#ff00ff',
	Gold = '#ffd700',
	Green = '#008000',
	Indigo = '#4b0082',
	Khaki = '#f0e68c',
	LightBlue = '#add8e6',
	LightCyan = '#e0ffff',
	LightGreen = '#90ee90',
	LightGrey = '#d3d3d3',
	LightPink = '#ffb6c1',
	Lightyellow = '#ffffe0',
	Lime = '#00ff00',
	Magenta = '#ff00ff',
	Maroon = '#800000',
	Navy = '#000080',
	Olive = '#808000',
	Orange = '#ffa500',
	Pink = '#ffc0cb',
	Purple = '#800080',
	Violet = '#800080',
	Red = '#ff0000',
	Silver = '#c0c0c0',
	White = '#ffffff',
	Yellow = '#ffff00',
}

export
type ActiveProfileSetter = (newProfileId: string) => void;

export
interface Username {
	display: string;
	ownerId: string;
}

export
interface UserMeta {
	id: string;
	userId: string;
	username: string;
	lastOpenProfile: string;
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
interface SharedUserMap {
	[userId: string]: {
		username: string;
	};
}

export
interface Profile {
	date: string;
	id?: string;
	lastProcessing: string;
	name: string;
	notes: string;
	ownerId: string;
	sharedUsers: SharedUserMap;
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
	fromAccountId: string;
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
	expenseCategory: ExpenseCategory | null;
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
	expenseCategory: ExpenseCategory | null;
}

export
interface Transaction extends CommonTransaction {
	pending?: boolean;
	parentScheduledTransactionId: string;
	parentBudgetId: string;
	receiptUrls: string[];
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
