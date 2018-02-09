import localForage from 'localforage';
import cordovaSqliteDriver from 'localforage-cordovasqlitedriver';

export default
class Storage {
	public static init() {
		Storage.persist();

		localForage.defineDriver(cordovaSqliteDriver).then(function() {
			return localForage.setDriver([
					// Try setting cordovaSQLiteDriver if available,
				cordovaSqliteDriver._driver,
				// otherwise use one of the default localforage drivers as a fallback.
				// This should allow you to transparently do your tests in a browser
				localForage.INDEXEDDB,
				localForage.WEBSQL,
				localForage.LOCALSTORAGE,
			]);
		});
		(window as any).Storage = Storage;
	}

	public static clearAll() {
		return localForage.clear();
	}

	public static clearItem(key: string) {
		return localForage.removeItem(key);
	}

	public static getItem(key: string): Promise<any> {
		return localForage.getItem(key);
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
		return localForage.removeItem(key);
	}
	public static setItem(key: string, value: any) {
		return localForage.setItem(key, value);
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
