import PouchDB from 'pouchdb';
import { createDb, remoteDbExists } from '../shared/api';
import Storage from './storage';

const META_ID = 'metaData';

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
	public static async getMeta(dbId: string): Promise<DBMeta> {
		const db = await PouchStorage.openDb(dbId);
		let meta;

		meta = await db.get(META_ID) as any;

		return {
			name: meta.name,
		};
	}
	public static openDb(name: string) {
		return new PouchDB(name);
	}
	public static openRemoteDb(profileId: string) {
		return new PouchDB(PouchStorage.remoteDbUrl(profileId));
	}
	public static remoteDbUrl(profileId: string) {
		return `${location.protocol}//${location.hostname}/api/sync/profile-${profileId}`;
	}
	public static async removeDoc(data: PouchDocument, db: Database) {
		const pouchId = `${data.type}:${data.id}`;
		const doc = await db.get(pouchId);
		await db.remove({
			_id: pouchId,
			_rev: doc._rev,
		});
	}
	public static async saveDoc(data: PouchDocument, db: Database) {
		data = data.serialize ? data.serialize() : data;
		let pouchId;

		if(data._id) {
			pouchId = data._id;
			delete data._id;
		} else if(data.type) {
			pouchId = `${data.type}:${data.id}`;
		} else {
			pouchId = data.id;
		}
		try {
			const doc = await db.get(pouchId);

			try {
				await db.put({
					_id: pouchId,
					_rev: doc._rev,
					data,
				});
			} catch {
				//
			}
		} catch {
			await db.put({
				_id: pouchId,
				data,
			});
		}
	}
	public static async saveMeta(dbId: string, data: DBMeta) {
		const db = PouchStorage.openDb(dbId);

		try {
			const doc = await db.get(META_ID);

			try {
				await db.put({
					_id: META_ID,
					_rev: doc._rev,
					...data,
				});
			} catch {
				//
			}
		} catch {
			await db.put({
				_id: META_ID,
				...data,
			});
		}
	}
	public static async sync(dbId: string) {
		if(!(await remoteDbExists(dbId))) {
			const profileMetas = Storage.getItem('profiles-local') as ProfileMetaData[];
			const profile = profileMetas.find((meta) => meta.id === dbId);
			await PouchStorage.createRemoteDB(dbId, profile.name);
		}

		const db = PouchStorage.openDb(dbId);
		const sync = PouchDB.sync(db, PouchStorage.openRemoteDb(dbId));

		// Why won't the sync stop on its own?
		setTimeout(() => {
			sync.cancel();
		}, 500);	}
}

(window as any).PouchStorage = PouchStorage;
(window as any).PouchDB = PouchDB;
