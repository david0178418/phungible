import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
	response.send('Hello from Firebase!');
});

export
const userCreate = functions.auth.user().onCreate(() => {

});


// ////////
// async function initUserMOVINGTOSERVER(user: User) {
// 	const userMeta = await createUserMetaDocMOVINGTOSERVER(user.uid);

// 	if(userMeta) {
// 		await Promise.all([
// 			user.updateProfile({
// 				displayName: userMeta.username,
// 			}),
// 			db.doc(`${Collection.Usernames}/${userMeta.username}`).set({
// 				display: userMeta.username,
// 				ownerId: user.uid,
// 			}),
// 		]);

// 		return userMeta;
// 	} else {
// 		return false;
// 	}
// }
// async function createUserMetaDocMOVINGTOSERVER(userId: string): Promise<UserMeta | false> {
// 	const profile: Profile = {
// 		...createProfile(),
// 		name: 'Default',
// 		ownerId: userId,
// 	};

// 	const savedProfile = await saveDoc(profile, Collection.Profiles);

// 	if(!(savedProfile && savedProfile.id)) {
// 		return false;
// 	}

// 	let username = '';

// 	do {
// 		const tryUsername = 'Rando' + ((Math.random() * 10000) | 0);

// 		username = (await getUsername(tryUsername)) ?
// 			'' : // username taken
// 			tryUsername;
// 	} while(!username);

// 	const userMetaDoc: UserMeta = {
// 		id: userId,
// 		userId,
// 		username,
// 		lastOpenProfile: savedProfile.id,
// 	};

// 	try {
// 		await db.doc(`${Collection.UserMetas}/${userId}`).set(userMetaDoc);
// 	} catch {
// 		return false;
// 	}

// 	return userMetaDoc;
// }
