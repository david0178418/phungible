import { Collection, Docs, Account, AccountType, Budget, RepeatType, RepeatUnit, TransactionType, RecurringTransaction } from './interfaces';
import { firestore } from 'firebase/app';

// type CollectionReference = firestore.Query<firestore.DocumentData>;
let db = firestore();

type DocReference = firestore.DocumentReference<firestore.DocumentData>;

export
async function formatDocument<T = any>(request: DocReference) {
	const result = await request.get();

	return result.data() as T || null;
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
function getDocRef(path: string) {
	return db.doc(path);
}

export
function getCollectionRef(path: string) {
	return db.collection(path);
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
function createAccount(): Account {
	return {
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
		startDate: (new Date()).toISOString(),
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
		startDate: (new Date()).toISOString(),
		towardAccountId: '',
		type: TransactionType.Income,
	};
}
