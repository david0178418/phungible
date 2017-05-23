import {useStrict} from 'mobx';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import * as React from 'react';
import {render} from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './routes';

OfflinePluginRuntime.install({
	onUpdateReady() {
		OfflinePluginRuntime.applyUpdate();
	},
	onUpdated() {
		setTimeout(() => {
			renderApp(true);
		}, 3000);
	},
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
useStrict(true);

function renderApp(updateAvailable: boolean) {
	render(
		React.createElement(Routes, {
			updateAvailable,
		}),
		document.getElementById('app')
	);
}

renderApp(false);

const loadingContainer = document.querySelector('.app-loading-container');
loadingContainer.className = 'app-loading-container finish'

setTimeout(() => {
	loadingContainer.remove();
}, 500);
