import * as SecureLS from 'secure-ls';
(window as any).SecureLS = SecureLS;

export default
class Storage {
	public static ls: any;

	public static isEncrypted() {
		// read directly since we use this to determine encryption status
		return !!localStorage.getItem('encrypted');
	}

	public static init(key?: string) {
		let result = false;
		if(Storage.isEncrypted() && key) {
			Storage.useEncryption(key);

			try {
				Storage.ls.get('lastProfileId');
				result = true;
			} catch(e) {
				Storage.ls = null;
			}
		} else {
			Storage.useNoEncryption();
			result = true;
		}

		Storage.persist();
		(window as any).Storage = Storage;
		return result;
	}

	public static clearAll() {
		Storage.ls.clear();
	}

	public static clearItem(key: string) {
		localStorage.removeItem(key);
	}

	public static disableEncryption() {
		Storage.useNoEncryption();
		localStorage.removeItem('encrypted');
	}

	public static enableEncryption(key: string) {
		Storage.useEncryption(key);
		localStorage.setItem('encrypted', 'true');
	}

	public static getItem(key: string): any {
		let data;

		try {
			data = Storage.ls.get(key);
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
	public static removeItem(key: string) {
		Storage.ls.remove(key);
	}
	public static setItem(key: string, value: any) {
		try {
			Storage.ls.set(key, value);
		} catch(e) {
			return;
		}
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

	private static useEncryption(key: string) {
		Storage.ls = new SecureLS({
			encodingType: 'aes',
			encryptionSecret: key,
			isCompression: true,
		});
	}

	private static useNoEncryption() {
		Storage.ls = new SecureLS({
			encodingType: '',
			isCompression: false,
		});
	}
}
