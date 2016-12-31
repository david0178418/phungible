import {useStrict} from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app';

useStrict(true);

ReactDOM.render(
	React.createElement(App, {}),
	document.getElementById('app'),
);
