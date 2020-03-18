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
} from './interfaces';
import { firestore, auth } from 'firebase/app';
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
		return;
	}

	const loader = await loadingController.create({
		message: 'Running initial setup...',
	});

	await loader.present();

	const credential = await a.signInAnonymously();

	if(credential.user) {
		// TODO Move chunks of this to server side
		await createUserMetaDoc(credential.user.uid);
		credential.user.updateProfile({
			displayName: 'Rando' + ((Math.random() * 10000) | 0),
		});
	}

	await loader.remove();
}

async function createUserMetaDoc(userId: string) {
	const profile: Profile = {
		...createProfile(),
		name: 'Default',
		ownerId: userId,
	};

	const savedProfile = await saveDoc(profile, Collection.Profiles);

	if(!savedProfile) {
		return false;
	}

	await db.doc(`${Collection.UserMetas}/${userId}`).set({
		id: userId,
		userId,
		currentProfileId: savedProfile.id,
	});
}

export
async function saveDoc<T extends Docs>(doc: T, collection: Collection) {
	await userCheck();
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
async function getUserMeta() {
	const userId = auth().currentUser?.uid;

	if(!userId) {
		return null;
	}

	return getDoc<UserMeta>(`${Collection.UserMetas}/${userId}`);
}

export
function createAccount(): Account {
	return {
		date: startOfDay(new Date()).toISOString(),
		balanceUpdateHistory: [],
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId: '',
		type: AccountType.Savings,
	};
}

export
function createBudget(): Budget {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		ownerId: '',
		profileId: '',
		repeatType: RepeatType.Days,
		repeatUnit: RepeatUnit.Week,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		transactionType: TransactionType.BudgetedExpense,
	};
}

export
function createRecurringTransaction(): RecurringTransaction {
	return {
		amount: 0,
		exceptions: [],
		fromAccountId: '',
		labels: [],
		name: '',
		notes: '',
		profileId: '',
		repeatType: RepeatType.Dates,
		repeatUnit: RepeatUnit.Month,
		repeatValues: [],
		date: startOfDay(new Date()).toISOString(),
		towardAccountId: '',
		type: TransactionType.Income,
	};
}

export
function createTransaction(budget?: Budget): Transaction {
	return {
		amount: 0,
		fromAccountId: budget?.fromAccountId || '',
		labels: [],
		name: budget ? `${budget.name} Expense` : '',
		date: startOfDay(new Date()).toISOString(),
		notes: '',
		profileId: budget?.profileId || '',
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
		sharedUsers: [],
	};
}
