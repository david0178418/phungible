if(!window.fetch) {
	import('whatwg-fetch');
}

export
function activate(activationCode: string) {
	return fetch(`${API_URI}/activate/${activationCode}`)
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
	return fetch(`${API_URI}/feedback`, {
			body: JSON.stringify(feedbackData),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'post',
		})
		.then((responseText) => responseText.json());
}

(window as any).activate = activate;
