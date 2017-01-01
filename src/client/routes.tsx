import * as React from 'react';
import {browserHistory, Route, Router} from 'react-router';

import App from './app';
import CreateBudgetItem from './components/create-budget-item';

export default
function Routes() {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<Route path="create-budget-item" component={CreateBudgetItem} />
			</Route>
		</Router>
	);
}
