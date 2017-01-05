import {useStrict} from 'mobx';
import * as React from 'react';
import {render} from 'react-dom';

import Routes from './routes';

useStrict(false);

render(
	React.createElement(Routes, {}),
	document.getElementById('app'),
);
