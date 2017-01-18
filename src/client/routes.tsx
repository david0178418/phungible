import * as React from 'react';
import {IndexRoute, Route, Router} from 'react-router';
import {browserHistory} from 'react-router';

import App from './app';
import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
import CreateScheduledTransaction from './components/create-scheduled-transaction';
import Index from './components/index';
import ScheduledTransactions from './components/schduled-transactions';

export default
function Routes() {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Index} />
				<Route path="schduled-transactions" component={ScheduledTransactions} />
				<Route path="create-scheduled-transaction(/:id)" component={CreateScheduledTransaction} />
				<Route path="accounts" component={Accounts} />
				<Route path="account-edit(/:id)" component={AccountEdit} />
			</Route>
		</Router>
	);
}
