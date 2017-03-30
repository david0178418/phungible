import * as React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';

import App from './app';

export default
function Routes() {
	return (
		<Router>
			<Route render={(props) => {
				return <App path={props.location.pathname}/>;
			}} />
		</Router>
	);
}
