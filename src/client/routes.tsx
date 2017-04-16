import * as React from 'react';
import {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';

import App from './app';

import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
import CreateScheduledTransaction from './components/create-scheduled-transaction';
import Home from './components/home';
import ScheduledTransactions from './components/schduled-transactions';
import TransactionEdit from './components/transaction-edit/';
import Transaction from './components/transactions';
import Trends from './components/trends';

export default
class Routes extends Component<any, any> {
	public render() {
		return (
			<Router>
				<Route>
					<App>
						<Route exact path="/" render={() => <Home/>}/>
						<Route path="/trends" render={() => <Trends/>} />
						<Route path="/account/edit/:id?" render={({match}) => (
							<AccountEdit id={match.params.id} />
						)} />
						<Route path="/accounts" render={() => <Accounts/>} />
						<Route path="/scheduled-transaction/edit/:id?" render={({match}) => (
							<CreateScheduledTransaction id={match.params.id} />
						)} />
						<Route path="/scheduled-transactions" render={() => (
							<ScheduledTransactions/>
						)} />
						<Route path="/transaction/edit/:id?" render={({match}) => (
							<TransactionEdit id={match.params.id} />
						)} />
						<Route path="/transactions" render={() => <Transaction/>} />
					</App>
				</Route>
			</Router>
		);
	}
}
