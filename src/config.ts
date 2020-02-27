import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export
const config = {
	apiUri: '',
	appVersion: require('../package.json').version,
	firebaseConfig: {
		apiKey: 'AIzaSyChiuiJED2Sm2GWd6Ja81fSvtQygW0R25k',
		authDomain: 'phungible.firebaseapp.com',
		databaseURL: 'https://phungible.firebaseio.com',
		projectId: 'phungible',
		storageBucket: 'phungible.appspot.com',
		messagingSenderId: '685598292878',
		appId: '1:685598292878:web:e6194d2a51876e3c45c2df',
	},
};

// TODO Move to environment variables
initializeApp(config.firebaseConfig);

if(window.location.hostname !== 'localhost') {
	// analytics();
}
