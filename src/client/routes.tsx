import * as React from 'react';
import {hashHistory, IndexRoute, Route, Router} from 'react-router';

import App from './app';
import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
import CreateScheduledTransaction from './components/create-scheduled-transaction';
import Index from './components/index';
import ScheduledTransactions from './components/schduled-transactions';
import TransactionEdit from './components/transaction-edit/';
import Transaction from './components/transactions';

export default
function Routes() {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Index} />
				<Route path="account/edit(/:id)" component={AccountEdit} />
				<Route path="accounts" component={Accounts} />
				<Route path="scheduled-transaction/edit(/:id)" component={CreateScheduledTransaction} />
				<Route path="scheduled-transactions" component={ScheduledTransactions} />
				<Route path="transaction/edit(/:id)" component={TransactionEdit} />
				<Route path="transactions" component={Transaction} />
			</Route>
		</Router>
	);
}
