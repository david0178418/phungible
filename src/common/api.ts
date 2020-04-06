import {
	Collection,
	Docs,
	UserMeta,
	ProfileDocs,
	Username,
} from '@shared/interfaces';
import { firestore, auth } from 'firebase/app';
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
function getDocRef(path: string) {
	return db.doc(path);
}

export
function getCollectionRef(path: string) {
	return db.collection(path);
}

async function userSetup(): Promise<string> {
	const a = auth();

	if(a.currentUser) {
		throw new Error('User already exists');
	}

	const loader = await loadingController.create({
		message: 'Running initial setup...',
	});

	await loader.present();

	const { user } = await a.signInAnonymously();

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
async function saveProfileDoc<T extends ProfileDocs>(doc: T, collection: Collection) {
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
