interface ProfileMetaData {
	id: string;
	isSynced?: boolean;
	name: string;
	owner?: User;
}

interface User {
	username: string;
	email: string;
}

type ItemTypeName = 'Account' | 'Budget' | 'Recurring Transaction' | 'Transaction';
