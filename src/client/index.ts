import {useStrict} from 'mobx';
import * as React from 'react';
import {render} from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './routes';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
useStrict(false);

render(
	React.createElement(Routes, {}),
	document.getElementById('app'),
);
