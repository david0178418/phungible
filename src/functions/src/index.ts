import { auth, firestore } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';
import { Collection } from './shared/interfaces';
import { handleUserCreate } from './handlers/user-create';
import { handleUserDelete } from './handlers/user-delete';
import { handleProfileDelete } from './handlers/profile-delete';

initializeApp();

export
const userCreate = auth
	.user()
	.onCreate(handleUserCreate);

export
const userDelete = auth
	.user()
	.onDelete(handleUserDelete);

export
const profileDelete = firestore
	.document(`${Collection.Profiles}/{profileId}`)
	.onDelete(handleProfileDelete);
