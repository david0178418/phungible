import * as React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';

import App from './app';
import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
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
				<Route path="create-budget-entry(/:id)" component={CreateBudgetItem} />
				<Route path="accounts" component={Accounts} />
				<Route path="account-edit(/:id)" component={AccountEdit} />
			</Route>
		</Router>
	);
}
