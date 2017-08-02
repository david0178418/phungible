export
type Document = PouchDB.Core.IdMeta & PouchDB.Core.GetMeta & {
	id: string;
	type: string;
	parentId?: string;
};

export default
class Storage {
	public static isEncrypted() {
		return false;
	}

	public static async initLocalStorage(key?: string) {
		(window as any).Storage = Storage;
	}

	public static clearItem(key: string) {
		localStorage.removeItem(key);
	}

	// public static disableEncryption() {
	// 	Storage.useNoEncryption();
	// 	localStorage.removeItem('encrypted');
	// }

	// public static enableEncryption(key: string) {
	// 	Storage.useEncryption(key);
	// 	localStorage.setItem('encrypted', 'true');
	// }

	public static getItem(key: string): any {
		let data;

		try {
			data = JSON.parse(localStorage.getItem(key));
		} catch(e) {
			return null;
		}

		if(data) {
			return data;
		} else {
			return null;
		}
	}

	public static persist() {
		Storage.shouldPersist().then((persistent: boolean) => {
			if(persistent) {
				return;
			}
			const storage = (navigator as any).storage;

			if(storage && storage.persist) {
				storage.persist();
			}
		});
	}
	public static setItem(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	private static shouldPersist() {
		const storage = (navigator as any).storage;

		if(storage && storage.persisted && storage.persist) {
			return storage.persisted();
		} else {
			return {
				then(cb: () => void) {
					cb();
				},
			};
		}
	}
}
