import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Component} from 'react';
import * as React from 'react';
import {Route} from 'react-router-dom';
import {getItem} from '../client/shared/storage';

import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
import CreateScheduledTransaction from './components/create-scheduled-transaction';
import Index from './components/index';
import ScheduledTransactions from './components/schduled-transactions';
import TransactionEdit from './components/transaction-edit/';
import Transaction from './components/transactions';
import Layout from './layout';
import AppStore from './shared/stores/app';

type Props = {
	path: string;
};

export default
class App extends Component<Props, any> {
	public store: AppStore;

	constructor(props: Props) {
		super(props);
		const data = getItem('store');

		if(data) {
			this.store = AppStore.deserialize(data);
		} else {
			this.store = new AppStore();
		}

		this.store.runTransactionSinceLastUpdate();

		// Check every 5 minutes.  Runs transactions when day rolls over
		setTimeout(() => {
			this.store.runTransactionSinceLastUpdate();
		}, 1000 * 60 * 5);
	}

	public shouldComponentUpdate(nextProps: Props)  {
		return this.props.path !== nextProps.path;
	}

	public render() {
		const store = this.store;
		return (
			<MuiThemeProvider>
				<Layout>
					<Route exact path="/" render={(props) => {
						return <Index store={store}/>;
					}} />
					<Route path="/account/edit/:id?" render={(props) => {
						return <AccountEdit store={store} id={props.match.params.id} />;
					}} />
					<Route path="/accounts" render={(props) => {
						return <Accounts store={store}/>;
					}} />
					<Route path="/scheduled-transaction/edit/:id?" render={(props) => {
						return <CreateScheduledTransaction store={store} id={props.match.params.id} />;
					}} />
					<Route path="/scheduled-transactions" render={(props) => {
						return <ScheduledTransactions store={store}/>;
					}} />
					<Route path="/transaction/edit/:id?" render={(props) => {
						return <TransactionEdit store={store} id={props.match.params.id} />;
					}} />
					<Route path="/transactions" render={(props) => {
						return <Transaction store={store}/>;
					}} />
				</Layout>
			</MuiThemeProvider>
		);
	}
}
