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

(window as any).activate = activate;
