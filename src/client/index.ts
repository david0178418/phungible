import {useStrict} from 'mobx';
import * as React from 'react';
import {render} from 'react-dom';
import './polyfills';

import Routes from './routes';

useStrict(true);

render(
	React.createElement(Routes),
	document.getElementById('app'),
);

beginTransition();

function beginTransition() {
	const loadingContainer = document.querySelector('.app-loading-container');
	const appContainer = document.getElementById('app');
	const pageLoadTime = (window as any).pageLoadTime;
	const elapsedTime = Date.now() - pageLoadTime;

	setTimeout(runTrans, 500 - elapsedTime);

	function runTrans() {
		loadingContainer.className = 'app-loading-container hide';
		appContainer.className = '';
		setTimeout(() => {
			loadingContainer.remove();
		}, 500);
	}
}
