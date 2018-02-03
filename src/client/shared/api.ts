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

		if(response.status === 401) {
			(window as any).store.logout();
			throw new Error('unauthorized');
		}

		return await response.json();
	} catch(e) {
		//
	}
}
