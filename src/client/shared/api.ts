if(!window.fetch) {
	import('whatwg-fetch');
}

type HTTP_ACTION =
	'delete' |
	'get' |
	'post';

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
		return response.json();
	} catch(e) {
		return e;
	}
}

export
function activate(activationCode: string) {
	const headers = new Headers();
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/json');
	return fetch(`${API_URI}/activate/${activationCode}`, {
			headers,
		})
		.then((response) => response.json())
		.then((activationSuccessful) => activationSuccessful)
		.catch((e) => true); // Just let them through if there is an error
}

interface FeedbackData {
	debugData: string;
	email: string;
	feedback: string;
	isBug: boolean;
}

export
function submitFeedback(feedbackData: FeedbackData) {
	return api(`${API_URI}/feedback`, 'post', feedbackData);
}

export
function register(email: string, password: string) {
	return api(`${API_URI}/register`, 'post', {
		name: email,
		password,
	});
}

export
function login(email: string, password: string) {
	return api(`${API_URI}/sync/_session`, 'post', {
		name: email,
		password,
	});
}

export
async function logout() {
	return api(`${API_URI}/sync/_session`, 'delete');
}

export
function isLoggedIn() {
	return api(`${API_URI}/sync/_session`, 'get');
}
