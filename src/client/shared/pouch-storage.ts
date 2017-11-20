import PouchDB from 'pouchdb';
import { createDb, remoteDbExists } from '../shared/api';
import Storage from './storage';

type Database = PouchDB.Database;

export
interface PouchDocument {
	id: string;
	type?: string;
	parent?: string;
	serialize?(): any;
}

export default
class PouchStorage {
	public static async createRemoteDB(id: string, name: string) {
		const response = await createDb(id, name);

		return !!response.ok;
	}
	public static async deleteDb(id: string) {
		const db = PouchStorage.openDb(id);
		return db.destroy();
	}
	public static async getAllType(type: string, db: Database, parentId?: string) {
		const result = await db.allDocs({
			endkey: `${type}:\ufff0`,
			include_docs: true,
			startkey: `${type}:`,
		}) as any;
		return result
			.rows
			.map((row: any) => row.doc.data)
			.filter((doc: PouchDocument) => !parentId || doc.parent === parentId);
	}
	public static async getDoc(docId: string, db: Database) {
		let doc;

		try {
			doc = await db.get(docId) as any;
		} catch {
			//
		}
		return doc ? doc.data : null;
	}
	public static openDb(name: string) {
		return new PouchDB(name);
	}
	public static remoteDbUrl(profileId: string) {
		return `${location.protocol}//${location.hostname}/api/sync/profile-${profileId}`;
	}
	public static async removeDoc(data: PouchDocument, db: Database) {
		let done: any;
		const pouchId = `${data.type}:${data.id}`;

		db
			.get(pouchId)
			.then((doc) => {
				db
					.remove({
						_id: pouchId,
						_rev: doc._rev,
					})
					.then(done)
					.catch(done);
			})
			.catch(() => {
				// We
			});

		return new Promise((resolve) => done = resolve);
	}
	public static async saveDoc(data: PouchDocument, db: Database) {
		let done: any;
		data = data.serialize ? data.serialize() : data;
		const pouchId = data.type ? `${data.type}:${data.id}` : data.id;

		db
			.get(pouchId)
			.then((doc) => {
				db
					.put({
						_id: pouchId,
						_rev: doc._rev,
						data,
					})
					.then(done)
					.catch(done);
			})
			.catch(() => {
				db
					.put({
						_id: pouchId,
						data,
					})
					.then(done)
					.catch(done);
			});

		return new Promise((resolve) => done = resolve);
	}
	public static async sync(dbId: string) {
		if(!(await remoteDbExists(dbId))) {
			const profileMetas = Storage.getItem('profiles') as ProfileMetaData[];
			const profile = profileMetas.find((meta) => meta.id === dbId);
			await PouchStorage.createRemoteDB(dbId, profile.name);
		}

		const db = PouchStorage.openDb(dbId);
		const sync = PouchDB.sync(db, new PouchDB(PouchStorage.remoteDbUrl(dbId)));

		// Why won't the sync stop on its own?
		sync.then(() => console.log(111));
		setTimeout(() => {
			sync.cancel();
		}, 500);	}
}

(window as any).PouchStorage = PouchStorage;
(window as any).PouchDB = PouchDB;
