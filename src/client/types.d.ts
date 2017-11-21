interface ProfileMetaData {
	id: string;
	isRemote: boolean;
	isLocal: boolean;
	name: string;
	owner?: User;
}

interface User {
	username: string;
	email?: string;
}

type ItemTypeName = 'Account' | 'Budget' | 'Recurring Transaction' | 'Transaction';
