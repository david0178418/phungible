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

function getCurrengtHash() {
	let hash = window.location.hash;

	if(!hash) {
		window.location.hash = hash = Home.path;
	} else {
		// remove leading "#"
		hash = hash.substr(1);
	}

	return hash;
}

export default
class Routes extends Component<Props, State> {
	private router: Navigo;

	constructor(props: Props) {
		super(props);

		this.state = {
			page: getCurrengtHash(),
			params: {},
		};

		this.router = new N(null, true);
	}

	public componentDidMount() {
		this.router.on({
			[Home.path]: () => this.setPage(Home.path),
			[AccountEdit.path]: () => this.setPage(AccountEdit.path),
			[AccountEdit.pathParams]: (params) => this.setPage(AccountEdit.path, params),
			[Accounts.path]: () => this.setPage(Accounts.path),
			[CreateScheduledTransaction.path]: () => this.setPage(CreateScheduledTransaction.path),
			[CreateScheduledTransaction.pathParams]: (params) => this.setPage(CreateScheduledTransaction.path, params),
			[ScheduledTransactions.path]: () => this.setPage(ScheduledTransactions.path),
			[TransactionEdit.path]: () => this.setPage(TransactionEdit.path),
			[TransactionEdit.pathParams]: (params) => this.setPage(TransactionEdit.path, params),
			[Transactions.path]: () => this.setPage(Transactions.path),
			[Trends.path]: () => this.setPage(Trends.path),
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
					{page === Home.path && <Home key={Home.path} />}
					{page === Trends.path && <Trends key={Trends.path} />}
					{page === Accounts.path && <Accounts key={Accounts.path}/>}
					{page === AccountEdit.path && <AccountEdit  key={AccountEdit.path} id={params.id} />}
					{page === Transactions.path && <Transactions key={Transactions.path}/>}
					{page === TransactionEdit.path && <TransactionEdit key={TransactionEdit.path} id={params.id} />}
					{page === ScheduledTransactions.path && <ScheduledTransactions key={ScheduledTransactions.path}/>}
					{page === CreateScheduledTransaction.path &&
						<CreateScheduledTransaction key="scheduled-transaction-edit" id={params.id} />}

				</App>
			</div>
		);
	}
}
