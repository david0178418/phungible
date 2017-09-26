import PouchDB from 'pouchdb';

export
interface Document {
	id: string;
	type?: string;
	parent?: string;
	serialize?(): any;
}

let activeProfileDB: PouchDB.Database;

export default
class PouchStorage {
	public static deleteDb() {
		return activeProfileDB.destroy();
	}
	public static openDb(name: string) {
		if(activeProfileDB) {
			activeProfileDB.close();
		}
		activeProfileDB = new PouchDB(name);
		(window as any).activeProfileDB = activeProfileDB;
		return activeProfileDB;
	}
	public static async getDoc(docId: string) {
		let doc;

		try {
			doc = await activeProfileDB.get(docId) as any;
		} catch(e) {
			//
		}
		return doc ? doc.data : null;
	}
	public static async getAllType(type: string, parentId?: string) {
		const result = await activeProfileDB.allDocs({
			endkey: `${type}:\ufff0`,
			include_docs: true,
			startkey: `${type}:`,
		}) as any;
		return result
			.rows
			.map((row: any) => row.doc.data)
			.filter((doc: Document) => !parentId || doc.parent === parentId);
	}
	public static async saveDoc(data: Document) {
		let done: any;
		data = data.serialize ? data.serialize() : data;
		const pouchId = data.type ? `${data.type}:${data.id}` : data.id;

		activeProfileDB
			.get(pouchId)
			.then((doc) => {
				activeProfileDB
					.put({
						_id: pouchId,
						_rev: doc._rev,
						data,
					})
					.then(done)
					.catch(done);
			})
			.catch(() => {
				activeProfileDB
					.put({
						_id: pouchId,
						data,
					})
					.then(done)
					.catch(done);
			});

		return new Promise((resolve) => done = resolve);
	}

	public static async removeDoc(data: Document) {
		let done: any;
		const pouchId = `${data.type}:${data.id}`;

		activeProfileDB
			.get(pouchId)
			.then((doc) => {
				activeProfileDB
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
}
