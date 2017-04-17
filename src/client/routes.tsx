import * as N from 'navigo';
import * as React from 'react';
import {Component} from 'react';

import App from './app';

import AccountEdit from './components/account-edit';
import Accounts from './components/accounts';
import CreateScheduledTransaction from './components/create-scheduled-transaction';
import Home from './components/home';
import ScheduledTransactions from './components/schduled-transactions';
import TransactionEdit from './components/transaction-edit/';
import Transactions from './components/transactions';
import Trends from './components/trends';

type Props = {};
type State = {
	page: string;
	params: any;
};

export default
class Routes extends Component<Props, State> {
	private router: Navigo;

	constructor(props: Props) {
		super(props);

		this.state = {
			page: 'home',
			params: {},
		};

		this.router = new N(null, true);
		(window as any).router = this;
	}

	public componentDidMount() {
		this.router.on({
			'/': () => this.setPage('home'),
			'/account/edit/': () => this.setPage('account-edit'),
			'/account/edit/:id': (params) => this.setPage('account-edit', params),
			'/accounts/': () => this.setPage('accounts'),
			'/scheduled-transaction/edit/': () => this.setPage('scheduled-transaction-edit'),
			'/scheduled-transaction/edit/:id': (params) => this.setPage('scheduled-transaction-edit', params),
			'/scheduled-transactions/': () => this.setPage('scheduled-transactions'),
			'/transaction/edit/': () => this.setPage('transaction-edit'),
			'/transaction/edit/:id': (params) => this.setPage('transaction-edit', params),
			'/transactions/': () => this.setPage('transactions'),
			'/trends': () => this.setPage('trends'),
		})
		.resolve();
	}

	public setPage(page: string, params: object = {}) {
		this.setState({
			page,
			params,
		});
	}

	public render() {
		const {page, params} = this.state;
		return (
			<div>
				<App>
					{page === 'home' && <Home key="home" />}
					{page === 'trends' && <Trends key="trends" />}
					{page === 'accounts' && <Accounts />}
					{page === 'account-edit' && <AccountEdit  key="account-edit" id={params.id} />}
					{page === 'transactions' && <Transactions />}
					{page === 'transaction-edit' && <TransactionEdit key="transaction-edit" id={params.id} />}
					{page === 'scheduled-transactions' && <ScheduledTransactions />}
					{page === 'scheduled-transaction-edit' &&
						<CreateScheduledTransaction key="scheduled-transaction-edit" id={params.id} />}

				</App>
			</div>
		);
	}
}
