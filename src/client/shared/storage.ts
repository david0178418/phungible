export
function setItem(key: string, value: any) {
	localStorage.setItem(key, JSON.stringify(value));
}

export
function getItem(key: string): any {
	const data = localStorage.getItem(key);
	if(data) {
		return JSON.parse(data);
	} else {
		return null;
	}
}

export
function clearItem(key: string) {
	localStorage.removeItem(key);
}

function shouldPersist() {
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

export
function persist() {
	shouldPersist().then((persistent: boolean) => {
		if(persistent) {
			return;
		}
		const storage = (navigator as any).storage;

		if(storage && storage.persist) {
			storage.persist();
		}
	});
}
