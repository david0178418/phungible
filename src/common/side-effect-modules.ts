// Massive hack to defer loading of firebase's massive modules
// Watch ticket to determine when this can be refactored:
// https://github.com/firebase/firebase-js-sdk/issues/2241
import { firestore, auth } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export
type Firestore = firestore.Firestore;

export
type Auth = auth.Auth;

export
type DocReference = firestore.DocumentReference<firestore.DocumentData>;

export
type CollectionReference = firestore.Query<firebase.firestore.DocumentData>;

export {
	firestore as f,
	auth as a,
};
