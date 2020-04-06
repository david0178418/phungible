import { auth } from 'firebase-functions';
import { firestore, auth as faAuth } from 'firebase-admin';
import {
	Profile,
	Collection,
	Username,
	UserMeta,
} from '../shared/interfaces';
import { createProfile } from '../shared/create-docs';

export
async function handleUserCreate(user: auth.UserRecord) {
	console.log(`Creating user '${user.uid}'.`);
	const fs = firestore();

	let username = '';

	do {
		// Find unused username
		// tslint:disable-next-line: no-bitwise
		username = `Saver${(10000 * Math.random()) | 0}`;
		const existingUsername = await fs.doc(`${Collection.Usernames}/${username.toLowerCase()}`).get();

		if(existingUsername.exists) {
			username = '';
		}
	} while(!username);

	await faAuth().updateUser(user.uid, {
		displayName: username,
	});

	const batch = fs.batch();

	const newUsernameDoc: Username = {
		display: username,
		ownerId: user.uid,
	};
	const newProfile: Profile = {
		...createProfile(),
		name: 'Default',
		id: fs.collection(Collection.Profiles).doc().id,
		ownerId: user.uid,
	};
	const newUserMetaDoc: UserMeta = {
			id: user.uid,
			userId: user.uid,
			username,
			lastOpenProfile: newProfile.id || '',
		};

	batch.set(fs.doc(`${Collection.Usernames}/${username.toLowerCase()}`), newUsernameDoc);
	batch.set(fs.doc(`${Collection.Profiles}/${newProfile.id}`), newProfile);
	batch.set(fs.doc(`${Collection.UserMetas}/${newUserMetaDoc.id}`), newUserMetaDoc);

	await batch.commit();
}
