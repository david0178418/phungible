if(!window.fetch) {
	import('whatwg-fetch');
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
	const headers = new Headers();
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/json');

	return fetch(`${API_URI}/feedback`, {
			body: JSON.stringify(feedbackData),
			headers,
			method: 'post',
		})
		.then((responseText) => responseText.json());
}

export
function register(email: string, password: string) {
	return fetch(`${API_URI}/register`, {
		body: JSON.stringify({
			name: email,
			password,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'post',
	})
	.then((responseText) => responseText.json());
}

export
function login(email: string, password: string) {
	return fetch(`${API_URI}/sync/_session`, {
		body: JSON.stringify({
			name: email,
			password,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'post',
	})
	.then((responseText) => responseText.json());
}

export
function logout() {
	return fetch(`${API_URI}/sync/_session`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'delete',
	})
	.then((responseText) => responseText.json());
}
