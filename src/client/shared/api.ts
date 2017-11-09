if(!window.fetch) {
	import('whatwg-fetch');
}

type HTTP_ACTION =
	'delete' |
	'get' |
	'post' |
	'put';

interface FeedbackData {
	debugData: string;
	email: string;
	feedback: string;
	isBug: boolean;
}

interface UserCtx {
	name: string;
	rolse: string[];
}

export
function createDb(profileId: string) {
	return api(`${API_URI}/create-profile/${profileId}`, 'put');
}

export
function getSyncedProfiles(): Promise<AccountProfiles> {
	const username = localStorage.getItem('username');

	if(!username) {
		return new Promise((resolve) => resolve(null));
	}

	return api(`${API_URI}/profiles/${username}`, 'get');
}

export
async function getUserContext(): Promise<UserCtx | null> {
	const { userCtx } = await api(`${API_URI}/sync/_session`, 'get');

	return userCtx;
}

export
function login(username: string, password: string) {
	return api(`${API_URI}/sync/_session`, 'post', {
		name: username,
		password,
	});
}

export
function logout() {
	return api(`${API_URI}/sync/_session`, 'delete');
}

export
function register(username: string, password: string) {
	return api(`${API_URI}/register`, 'post', {
		name: username,
		password,
	});
}

export
async function remoteDbExists(profileId: string) {
	try {
		const response = await api(`${API_URI}/sync/profile-${profileId}`, 'get');
		return !!response.db_name;
	} catch {
		return false;
	}
}

export
function submitFeedback(feedbackData: FeedbackData) {
	return api(`${API_URI}/feedback`, 'post', feedbackData);
}

async function api(uri: string, method: HTTP_ACTION, data?: any) {
	const headers = new Headers();
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/json');
	try {
		const response = await fetch(uri, {
			body: JSON.stringify(data),
			credentials: 'same-origin',
			headers,
			method,
		});
		return await response.json();
	} catch(e) {
		return e;
	}
}
