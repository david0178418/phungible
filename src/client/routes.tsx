import * as React from 'react';
import {browserHistory, IndexRoute, Route, Router} from 'react-router';

import App from './app';
import CreateBudgetItem from './components/create-budget-entry/index';
import Index from './components/index';
import Overview from './components/overview';

export default
function Routes() {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Index} />
				<Route path="overview" component={Overview} />
				<Route path="create-budget-entry" component={CreateBudgetItem} />
			</Route>
		</Router>
	);
}
