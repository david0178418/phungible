import 'whatwg-fetch';

export
function activate(activationCode: string) {
	return fetch(`${API_URI}/activate/${activationCode}`)
		.then((response) => response.json())
		.then((activationSuccessful) => activationSuccessful)
		.catch((e) => true); // Just let them through if there is an error
}

(window as any).activate = activate;
