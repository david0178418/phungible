export
function setItem(key: string, value: any) {
	localStorage.setItem(key, JSON.stringify(value));
}

export
function getItem(key: string) {
	const data = localStorage.getItem(key);
	if(data) {
		return JSON.parse(data);
	} else {
		return null;
	}
}
