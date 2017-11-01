interface AccountProfiles {
	accessible: ProfileMetaData[];
	owned: ProfileMetaData[];
}

interface ProfileMetaData {
	id: string;
	isSynced?: boolean;
	name: string;
}
