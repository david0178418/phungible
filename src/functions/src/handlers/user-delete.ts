import {auth } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import {
	Collection,
	Profile,
} from '../shared/interfaces';

export
async function handleUserDelete(user: auth.UserRecord) {
	console.log(`Deleteing user '${user.uid}'.`);
	const fs = firestore();
	const batch = fs.batch();


	const profiles =  await fs.collection(Collection.Profiles)
			.where('ownerId', '==', user.uid)
			.get();

	profiles.docs
		.map(p => p.data() as Profile)
		.forEach(p => {
			batch.delete(fs.doc(`${Collection.Profiles}/${p.id}`));
		});

	const sharedProfiles =  await fs.collection(Collection.Profiles)
		.where(`sharedUsers.${user.uid}.username`, '==', user.displayName?.toLowerCase())
		.get();
	
	sharedProfiles.docs
		.map(p => p.data() as Profile)
		.forEach(p => {
			batch.set(fs.doc(`${Collection.Profiles}/${p.id}`), {
				[`sharedUsers.${user.uid}.username`]: firestore.FieldValue.delete(),
			}, {
				merge: true,
			});
		});

	batch.delete(fs.doc(`${Collection.UserMetas}/${user.uid}`));
	batch.delete(fs.doc(`${Collection.Usernames}/${user.displayName?.toLowerCase()}`));

	await batch.commit();
}
