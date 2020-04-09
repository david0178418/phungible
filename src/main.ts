import * as React from 'react';
import { render } from 'react-dom';
import { App } from './app';
import { setupConfig } from '@ionic/react';
import { dynamicallyLoadScript } from '@shared/utils';

const IS_DEV = process.env.NODE_ENV === 'development';

setupConfig({
	mode: 'md',
});

render(
	React.createElement(App),
	document.getElementById('app'),
);

// Check that service workers are supported
if(!IS_DEV && 'serviceWorker' in navigator) {
	import('./sw-loader').then((x) => x.init());
}

if(window.location.hostname === 'phungible') {
	setTimeout(() => {
		dynamicallyLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-99423781-1');
	}, 7000);
}
//
// https://github.com/angular/angular-cli/issues/13351
// if ('serviceWorker' in navigator && environment.production) {
// 	navigator.serviceWorker.register('/combined-sw.js');
// }
