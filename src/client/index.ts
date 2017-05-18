import {useStrict} from 'mobx';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import * as React from 'react';
import {render} from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './routes';
import ProfilesStore from './stores/profiles';

OfflinePluginRuntime.install();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
useStrict(true);

ProfilesStore.TEMPMigrateLegacyStoreToProfile();

render(
	React.createElement(Routes, {}),
	document.getElementById('app'),
);
