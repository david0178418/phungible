import * as React from 'react';
import { render } from 'react-dom';
import { App } from './app';

render(
	React.createElement(App),
	document.getElementById('app'),
);


// if (environment.production) {
// 	setTimeout(() => {
// 		dynamicallyLoadScript('https://www.googletagmanager.com/gtag/js?id=UA-116286258-1');
// 	}, 7000);
// }
//
// https://github.com/angular/angular-cli/issues/13351
// if ('serviceWorker' in navigator && environment.production) {
// 	navigator.serviceWorker.register('/combined-sw.js');
// }
