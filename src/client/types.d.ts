interface AccountProfiles {
	accessible: ProfileMetaData[];
	owned: ProfileMetaData[];
}

interface ProfileMetaData {
	id: string;
	isSynced?: boolean;
	name: string;
}

type ItemTypeName = 'Account' | 'Budget' | 'Recurring Transaction' | 'Transaction';
