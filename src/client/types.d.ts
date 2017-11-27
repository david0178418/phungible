type Database = PouchDB.Database;

interface DBMeta {
	name: string;
}

interface ProfileMetaData {
	id: string;
	name: string;
	owner?: User;
}

interface PouchDocument {
	_id?: string;
	id: string;
	type?: string;
	parent?: string;
	serialize?(): any;
}

interface User {
	username: string;
	email?: string;
}

type ItemTypeName = 'Account' | 'Budget' | 'Recurring Transaction' | 'Transaction';
