import * as N from 'navigo';
import * as React from 'react';
import {Component} from 'react';

import App from './app';

import {
	AccountEditPage,
	AccountsPage,
	HomePage,
	ScheduledTransactionEditPage,
	ScheduledTransactionsPage,
	TransactionEditPage,
	TransactionsPage,
	TrendsPage,
} from './components/pages';

type Props = {};
type State = {
	disableNextPageAnimation: boolean;
	page: string;
	params: any;
};

function getCurrengtHash() {
	let hash = window.location.hash;

	if(!hash) {
		window.location.hash = hash = HomePage.path;
	} else {
		// remove leading "#"
		hash = hash.substr(1);
	}

	return hash;
}

export default
class Routes extends Component<Props, State> {
	private router: Navigo;
	private horizontalSlidePages: string[];

	constructor(props: Props) {
		super(props);

		this.state = {
			disableNextPageAnimation: false,
			page: getCurrengtHash(),
			params: {},
		};

		this.horizontalSlidePages = [
			AccountEditPage.path,
			ScheduledTransactionEditPage.path,
			TransactionEditPage.path,
		];

		this.router = new N(null, true);
	}

	public componentWillMount() {
		this.router.on({
			[HomePage.path]: () => this.setPage(HomePage.path),
			[AccountEditPage.path]: () => this.setPage(AccountEditPage.path),
			[AccountEditPage.pathParams]: (params) => this.setPage(AccountEditPage.path, params),
			[AccountsPage.path]: () => this.setPage(AccountsPage.path),
			[ScheduledTransactionEditPage.path]: () => this.setPage(ScheduledTransactionEditPage.path),
			[ScheduledTransactionEditPage.pathParams]: (params) => this.setPage(ScheduledTransactionEditPage.path, params),
			[ScheduledTransactionsPage.path]: () => this.setPage(ScheduledTransactionsPage.path),
			[TransactionEditPage.path]: () => this.setPage(TransactionEditPage.path),
			[TransactionEditPage.pathParams]: (params) => this.setPage(TransactionEditPage.path, params),
			[TransactionsPage.path]: () => this.setPage(TransactionsPage.path),
			[TrendsPage.path]: () => this.setPage(TrendsPage.path),
		})
		.resolve();
	}

	public setPage(page: string, params: object = {}) {
		this.setState({
			disableNextPageAnimation: this.currentPageIsHorizontalSlide(),
			page,
			params,
		});
	}

	public render() {
		const {
			disableNextPageAnimation,
			page,
			params,
		} = this.state;

		const id = params && params.id;

		return (
			<div>
				<App>
					{page === HomePage.path && <HomePage key={HomePage.path} disableAnimation={disableNextPageAnimation} />}
					{page === TrendsPage.path && <TrendsPage key={TrendsPage.path} disableAnimation={disableNextPageAnimation} />}
					{page === AccountsPage.path &&
						<AccountsPage key={AccountsPage.path} disableAnimation={disableNextPageAnimation} />}
					{page === AccountEditPage.path && <AccountEditPage  key={AccountEditPage.path} id={id} />}
					{page === TransactionsPage.path &&
						<TransactionsPage key={TransactionsPage.path} disableAnimation={disableNextPageAnimation} />}
					{page === TransactionEditPage.path && <TransactionEditPage key={TransactionEditPage.path} id={id} />}
					{page === ScheduledTransactionsPage.path &&
						<ScheduledTransactionsPage key={ScheduledTransactionsPage.path} disableAnimation={disableNextPageAnimation} />}
					{page === ScheduledTransactionEditPage.path &&
						<ScheduledTransactionEditPage key={ScheduledTransactionEditPage.path} id={id} />}

				</App>
			</div>
		);
	}

	private currentPageIsHorizontalSlide() {
		return this.horizontalSlidePages.indexOf(this.state.page) !== -1;
	}
}
