import {
	Collection,
	Docs,
	Account,
	AccountType,
	Budget,
	RepeatType,
	RepeatUnit,
	TransactionType,
	RecurringTransaction,
	Transaction,
	Profile,
	UserMeta,
	ProfileDocs,
	Username,
} from './interfaces';
import { firestore, auth, User } from 'firebase/app';
import { startOfDay } from 'date-fns';
import { loadingController } from '@ionic/core';

// type CollectionReference = firestore.Query<firestore.DocumentData>;
let db = firestore();

type DocReference = firestore.DocumentReference<firestore.DocumentData>;
type CollectionReference = firebase.firestore.Query<firebase.firestore.DocumentData>;

export
async function formatDocument<T = any>(request: DocReference) {
	const result = await request.get();

	return result.data() as T || null;
}

export
async function formatCollection<T = any>(request: CollectionReference) {
	const result = await request.get();

	return result.docs.map(doc => doc.data() as T);
}

export
function createId(collectionPath: Collection) {
	return db.collection(collectionPath).doc().id;
}

export
async function deleteDoc(id: string, collection: Collection) {
	await db.doc(`${collection}/${id}`).delete();
}

export
function getDoc<T = any>(path: string) {
	return formatDocument<T>(getDocRef(path));
}

export
async function getCollection<T = any>(path: Collection) {
	const results = await db.collection(path).get();

	return results
		.docs
		.map(doc => doc.data() as T);
}

export
function getDocRef(path: string) {
	return db.doc(path);
}

export
function getCollectionRef(path: string) {
	return db.collection(path);
}

async function userCheck() {
	const a = auth();

	if(a.currentUser) {
		return true;
	}

	const loader = await loadingController.create({
		message: 'Running initial setup...',
	});

	await loader.present();

	const { user } = await a.signInAnonymously();

	let userMeta: UserMeta | false = false;

	if(user) {
		// TODO Move chunks of this to server side
		userMeta = await initUser(user);
	}

	await loader.remove();

	return userMeta;
}

export
async function initUser(user: User) {
	const userMeta = await createUserMetaDoc(user.uid);

	if(userMeta) {
		await Promise.all([
			user.updateProfile({
				displayName: userMeta.username,
			}),
			db.doc(`${Collection.Usernames}/${userMeta.username}`).set({
				display: userMeta.username,
				ownerId: user.uid,
			}),
		]);

		return userMeta;
	} else {
		return false;
	}
}

async function createUserMetaDoc(userId: string): Promise<UserMeta | false> {
	const profile: Profile = {
		...createProfile(),
		name: 'Default',
		ownerId: userId,
	};

	const savedProfile = await saveDoc(profile, Collection.Profiles);

	if(!(savedProfile && savedProfile.id)) {
		return false;
	}

	let username = '';

	do {
		const tryUsername = 'Rando' + ((Math.random() * 10000) | 0);

		username = (await getUsername(tryUsername)) ?
			'' : // username taken
			tryUsername;
	} while(!username);

	const userMetaDoc: UserMeta = {
		id: userId,
		userId,
		username,
		lastOpenProfile: savedProfile.id,
	};

	try {
		await db.doc(`${Collection.UserMetas}/${userId}`).set(userMetaDoc);
	} catch {
		return false;
	}

	return userMetaDoc;
}

export
async function saveProfileDoc<T extends ProfileDocs>(doc: T, collection: Collection) {
	const userMeta = await userCheck();

	let profileId = doc.profileId;

	if(userMeta === false) {
		throw new Error('Error setting profile');
	} else if(userMeta !== true) {
		profileId = userMeta.lastOpenProfile;
	}

	const id = doc.id || db.collection(collection).doc().id;

	try {
		const newDoc: T = {
			...doc,
			profileId,
			id,
		};
		await db.doc(`${collection}/${id}`).set(newDoc);
		return newDoc;
	} catch(e) {
		console.error(`Failed to save doc ${doc.id} in collection ${collection}`, e);
		return false;
	}
}

export
async function saveDoc<T extends Docs>(doc: T, collection: Collection) {
	const id = doc.id || db.collection(collection).doc().id;

	try {
		const newDoc: T = {
			...doc,
			id,
		};
		await db.doc(`${collection}/${id}`).set(newDoc);
		return newDoc;
	} catch(e) {
		console.error(`Failed to save doc ${doc.id} in collection ${collection}`, e);
		return false;
	}
}

export
function getUsername(username: string) {
	return getDoc<Username>(`${Collection.Usernames}/${username}`);
}

export
async function getUserMeta() {
	const userId = auth().currentUser?.uid;

	if(!userId) {
		return null;
	}

	return getDoc<UserMeta>(`${Collection.UserMetas}/${userId}`);
}

export
function createAccount(profileId: string): Account {
	return {
		date: startOfDay(new Date()).toISOString(),
		balanceUpdateHistory: [],
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId,
		type: AccountType.Savings,
	};
}

export
function createBudget(profileId: string): Budget {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId,
		repeatType: RepeatType.Days,
		repeatUnit: RepeatUnit.Week,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		transactionType: TransactionType.BudgetedExpense,
	};
}

export
function createRecurringTransaction(profileId: string): RecurringTransaction {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		profileId,
		repeatType: RepeatType.Dates,
		repeatUnit: RepeatUnit.Month,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		towardAccountId: '',
		type: TransactionType.Income,
	};
}

export
function createTransaction(profileId: string, budget?: Budget): Transaction {
	return {
		amount: 0,
		fromAccountId: budget?.fromAccountId || '',
		labels: [],
		name: budget ? `${budget.name} Expense` : '',
		date: startOfDay(new Date()).toISOString(),
		notes: '',
		profileId,
		towardAccountId: '',
		type: TransactionType.Expense,
		parentBudgetId: budget?.id || '',
		parentScheduledTransactionId: '',
	};
}

export
function createProfile(): Profile {
	return {
		name: '',
		ownerId: '',
		notes: '',
		date: new Date().toISOString(),
		sharedUsers: {},
	};
}
