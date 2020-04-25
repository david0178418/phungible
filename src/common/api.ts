import {
	Collection,
	ProfileCollection,
	Docs,
	UserMeta,
	ProfileDocs,
	Username,
	RecurringTransaction,
	Profile,
	Transaction,
	ExpenseCategory,
} from '@shared/interfaces';
import { loadingController } from '@ionic/core';
import { occurrancesInRange } from '@common/occurrence-fns';
import { createTransactionFromRecurringTransaction } from '@shared/create-docs';
import { Firestore, Auth, DocReference } from './side-effect-modules';
import { CollectionReference } from '@google-cloud/firestore';
import { uuid } from '@shared/utils';

import('./side-effect-modules')
	.then(({f, a}) => {
		db = f();
		auth = a();
	});

// type CollectionReference = firestore.Query<firestore.DocumentData>;
let db: Firestore;
let auth: Auth;

export
function getBatch() {
	return db.batch();
}

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
function getDocRef(path: string) {
	return db.doc(path);
}

export
function getCollectionRef(path: string) {
	return db.collection(path);
}

async function userSetup(): Promise<string> {
	if(auth.currentUser) {
		throw new Error('User already exists');
	}

	const loader = await loadingController.create({
		message: 'Running initial setup...',
	});

	await loader.present();

	const { user } = await auth.signInAnonymously();

	if(!user) {
		throw new Error('Could not create anonymous user.');
	}

	const profileId = await getNextProfile(user.uid);

	await loader.dismiss();

	return profileId;
}

export
async function getNextProfile(userId: string) {
	return new Promise<string>((resolve) => {
		const unsub = getDocRef(`${Collection.UserMetas}/${userId}`)
			.onSnapshot(doc => {
				if(!doc.exists) {
					return;
				}

				const {lastOpenProfile} = doc.data() as UserMeta;
				resolve(lastOpenProfile);
				unsub();
			});
	});
}

export
async function saveProfileDoc<T extends ProfileDocs>(doc: T, collection: ProfileCollection) {
	const profileId = doc.profileId || await userSetup();
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
function getCollectionId(collection: Collection | string) {
	return db.collection(collection).doc().id;
}

export
async function saveDoc<T extends Docs>(doc: T, collection: Collection) {
	const id = doc.id || getCollectionId(collection);

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
	const userId = auth.currentUser?.uid;

	if(!userId) {
		return null;
	}

	return getDoc<UserMeta>(`${Collection.UserMetas}/${userId}`);
}

export
// TODO Find a place for this
async function runRecurringTransactionCheck(profile: Profile) {
	const now = (new Date()).toISOString();
	const lastUpdated = profile.lastProcessing || profile.date;
	const rtsSnap = await getCollectionRef(Collection.RecurringTransactions)
		.where('profileId', '==', profile.id)
		.get();

	const transactions = rtsSnap.docs
		.map(doc => doc.data() as RecurringTransaction)
		.map(rt =>
			occurrancesInRange(
				rt,
				lastUpdated > rt.date ?
					lastUpdated :
					rt.date,
				now,
			)
			.map(date => createTransactionFromRecurringTransaction(date, rt)),
		)
		.flat();

	const batch = getBatch();

	transactions.forEach(t => {
		const id = getCollectionId(Collection.Transactions);
		batch.set(getDocRef(`${Collection.Transactions}/${id}`), {
			...t,
			pending: true,
			id,
		});
	});

	batch.set(getDocRef(`${Collection.Profiles}/${profile.id}`), {
		...profile,
		lastProcessing: now,
	});

	batch.commit();
	
	console.log('new transactions', transactions);
}

export
async function getProfileDocs<T>(profileId: string, collection: ProfileCollection) {
	const { docs } = await db.collection(collection)
		.where('profileId', '==', profileId)
		.get();

	return docs.map(d => d.data() as T);
}

export
async function getProfileDocsInRange<T>(from: Date | string, to: Date | string, profileId: string, collection: ProfileCollection) {
	const fromStr = from instanceof Date ? from.toISOString() : from;
	const toStr = to instanceof Date ? to.toISOString() : to;
	
	const { docs } = await db.collection(collection)
		.where('profileId', '==', profileId)
		.where('date', '>=', fromStr)
		.where('date', '<', toStr)
		.get();

	return docs.map(d => d.data() as T);
}

export
async function getAccountTransactionsInRange(accountId: string, from: Date | string, to: Date | string) {
	const fromStr = from instanceof Date ? from.toISOString() : from;
	const toStr = to instanceof Date ? to.toISOString() : to;

	const query = db.collection(Collection.Transactions)
		.where('date', '>=', fromStr)
		.where('date', '<', toStr);

	const fromTransactions = await query.where('fromAccountId', '==', accountId).get();
	const towardTransactions = await query.where('towardAccountId', '==', accountId).get();

	return fromTransactions.docs
		.concat(towardTransactions.docs)
		.map(doc => doc.data() as Transaction);
}

export
async function setCategory(doc: ExpenseCategory, profile: Profile) {
	const id = doc.id || uuid();

	try {
		const newCategory = {
			...doc,
			id,
		};
		await db.doc(`${Collection.Profiles}/${profile.id}`).update({
			transactionCategories: [
				newCategory,
				...profile.transactionCategories,
			],
		});

		return newCategory;
	} catch(e) {
		console.error(`Failed to save doc transaction category ${doc.id}`, e);
		return false;
	}
}
