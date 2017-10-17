import PouchDB from 'pouchdb';
import { createDb, remoteDbExists } from '../shared/api';

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
	public static async createRemoteProfile(profileId: string) {
		const response = await createDb(profileId);

		return !!response.ok;
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
	public static async sync(db: Database, onChange?: () => void) {
		const dbInfo = await db.info();
		const profileId = dbInfo.db_name;

		if(!(await remoteDbExists(profileId))) {
			await PouchStorage.createRemoteProfile(profileId);
		}

		const sync = PouchDB.sync(db, new PouchDB(PouchStorage.remoteDbUrl(profileId)));

		// Why won't the sync stop on its own?
		setTimeout(() => {
			sync.cancel();

			if(onChange) {
				onChange();
			}
		}, 500);
	}
}

(window as any).PouchStorage = PouchStorage;
(window as any).PouchDB = PouchDB;
