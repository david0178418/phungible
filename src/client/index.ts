import {useStrict} from 'mobx';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import * as React from 'react';
import {render} from 'react-dom';
import './polyfills';

import Routes from './routes';

OfflinePluginRuntime.install({
	onUpdateReady() {
		OfflinePluginRuntime.applyUpdate();
	},
	onUpdated() {
		setTimeout(() => {
			renderApp(true);
		}, 2000);
	},
});

function renderApp(updateAvailable: boolean) {
	render(
		React.createElement(Routes, {
			updateAvailable,
		}),
		document.getElementById('app'),
	);
}

useStrict(true);
renderApp(false);
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
