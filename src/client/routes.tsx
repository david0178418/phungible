import * as N from 'navigo';
import * as React from 'react';
import {Component} from 'react';

import App from './app';

import {
	AccountEditPage,
	AccountsPage,
	BudgetEditPage,
	BudgetsPage,
	ClearDataPage,
	DailyActivityPage,
	Help,
	ScheduledTransactionEditPage,
	ScheduledTransactionsPage,
	SettingsPage,
	SummaryPage,
	TransactionEditPage,
	TransactionsPage,
	TrendsPage,
} from './pages';

type Props = {};
type State = {
	disableNextPageAnimation: boolean;
	page: string;
	params: any;
};

function getCurrengtHash() {
	let hash = window.location.hash;

	if(!hash) {
		window.location.hash = hash = DailyActivityPage.path;
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

		// TODO Refactor this
		this.horizontalSlidePages = [
			AccountEditPage.path,
			BudgetEditPage.path,
			ClearDataPage.path,
			ScheduledTransactionEditPage.path,
			TransactionEditPage.path,
		];

		this.router = new N(null, true);
	}

	// TODO dry this up
	public componentWillMount() {
		this.router.on({
			[SummaryPage.path]: () => this.setPage(SummaryPage.path),
			[AccountEditPage.path]: () => this.setPage(AccountEditPage.path),
			[AccountEditPage.pathParams]: (params) => this.setPage(AccountEditPage.path, params),
			[AccountsPage.path]: () => this.setPage(AccountsPage.path),
			[BudgetsPage.path]: () => this.setPage(BudgetsPage.path),
			[BudgetEditPage.path]: () => this.setPage(BudgetEditPage.path),
			[BudgetEditPage.pathParams]: (params) => this.setPage(BudgetEditPage.path, params),
			[ClearDataPage.path]: () => this.setPage(ClearDataPage.path),
			[DailyActivityPage.path]: () => this.setPage(DailyActivityPage.path),
			[Help.path]: () => this.setPage(Help.path),
			[ScheduledTransactionEditPage.path]: () => this.setPage(ScheduledTransactionEditPage.path),
			[ScheduledTransactionEditPage.pathParams]: (params) => this.setPage(ScheduledTransactionEditPage.path, params),
			[ScheduledTransactionsPage.path]: () => this.setPage(ScheduledTransactionsPage.path),
			[SettingsPage.path]: () => this.setPage(SettingsPage.path),
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

		// TODO dry this up
		return (
			<div>
				<App>
					{page === AccountsPage.path &&
						<AccountsPage
							disableAnimation={disableNextPageAnimation}
							key={AccountsPage.path}
						/>
					}
					{page === AccountEditPage.path &&
						<AccountEditPage
							id={id}
							key={AccountEditPage.path}
						/>
					}
					{page === BudgetsPage.path &&
						<BudgetsPage
							disableAnimation={disableNextPageAnimation}
							key={BudgetsPage.path}
						/>
					}
					{page === BudgetEditPage.path &&
						<BudgetEditPage
							id={id}
							key={BudgetEditPage.path}
						/>
					}
					{page === ClearDataPage.path &&
						<ClearDataPage
							key={ClearDataPage.path}
						/>
					}
					{page === DailyActivityPage.path &&
						<DailyActivityPage
							disableAnimation={disableNextPageAnimation}
							key={DailyActivityPage.path}
						/>
					}
					{page === Help.path &&
						<Help
							disableAnimation={disableNextPageAnimation}
							key={Help.path}
						/>
					}
					{page === TransactionsPage.path &&
						<TransactionsPage
							disableAnimation={disableNextPageAnimation}
							key={TransactionsPage.path}
						/>
					}
					{page === TransactionEditPage.path &&
						<TransactionEditPage
							id={id}
							key={TransactionEditPage.path}
						/>
					}
					{page === ScheduledTransactionsPage.path &&
						<ScheduledTransactionsPage
							disableAnimation={disableNextPageAnimation}
							key={ScheduledTransactionsPage.path}
						/>
					}
					{page === ScheduledTransactionEditPage.path &&
						<ScheduledTransactionEditPage
							id={id}
							key={ScheduledTransactionEditPage.path}
						/>
					}
					{page === SettingsPage.path &&
						<SettingsPage
							disableAnimation={disableNextPageAnimation}
							key={SettingsPage.path}
						/>
					}
					{page === SummaryPage.path &&
						<SummaryPage
							disableAnimation={disableNextPageAnimation}
							key={SummaryPage.path}
						/>
					}
					{page === TrendsPage.path &&
						<TrendsPage
							disableAnimation={disableNextPageAnimation}
							key={TrendsPage.path}
						/>
					}
				</App>
			</div>
		);
	}

	private currentPageIsHorizontalSlide() {
		return this.horizontalSlidePages.indexOf(this.state.page) !== -1;
	}
}
