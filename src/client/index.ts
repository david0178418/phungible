import {useStrict} from 'mobx';
import * as React from 'react';
import {render} from 'react-dom';

import Routes from './routes';

useStrict(true);

render(
	React.createElement(Routes, {}),
	document.getElementById('app'),
);
