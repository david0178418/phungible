import {Provider} from 'mobx-react';
import * as N from 'navigo';
import * as React from 'react';

import App from './app';
import Analytics from './shared/analytics';

const {Component} = React;

const TOUR_VIEWED_KEY = 'tour-viewed';

import {
	AccountEditPage,
	AccountsPage,
	BudgetEditPage,
	BudgetsPage,
	ClearDataPage,
	DailyActivityPage,
	FeedbackPage,
	GettingStartedPage,
	Help,
	ProfileManager,
	ScheduledTransactionEditPage,
	ScheduledTransactionsPage,
	SettingsPage,
	SummaryPage,
	TransactionEditPage,
	TransactionsPage,
	TrendsPage,
} from './pages';

interface Page {
	path: string;
	title: string;
}
type Props = {
};
type State = {
	ignoreUpdate: boolean;
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

	constructor(props: Props) {
		super(props);

		this.state = {
			ignoreUpdate: false,
			page: getCurrengtHash(),
			params: {},
		};

		this.router = new N(null, true);
	}

	// TODO dry this up
	public componentWillMount() {
		this.router.on({
			[SummaryPage.path]: () => this.setPage(SummaryPage),
			[AccountEditPage.path]: () => this.setPage(AccountEditPage),
			[AccountEditPage.pathParams]: (params) => this.setPage(AccountEditPage, params),
			[AccountsPage.path]: () => this.setPage(AccountsPage),
			[BudgetsPage.path]: () => this.setPage(BudgetsPage),
			[BudgetEditPage.path]: () => this.setPage(BudgetEditPage),
			[BudgetEditPage.pathParams]: (params) => this.setPage(BudgetEditPage, params),
			[ClearDataPage.path]: () => this.setPage(ClearDataPage),
			[DailyActivityPage.path]: () => this.setPage(DailyActivityPage),
			[DailyActivityPage.path]: () => this.setPage(DailyActivityPage),
			[FeedbackPage.path]: () => this.setPage(FeedbackPage),
			[GettingStartedPage.path]: () => this.setPage(GettingStartedPage),
			[Help.path]: () => this.setPage(Help),
			[ProfileManager.path]: () => this.setPage(ProfileManager),
			[ScheduledTransactionEditPage.path]: () => this.setPage(ScheduledTransactionEditPage),
			[ScheduledTransactionEditPage.pathParams]: (params) => this.setPage(ScheduledTransactionEditPage, params),
			[ScheduledTransactionsPage.path]: () => this.setPage(ScheduledTransactionsPage),
			[SettingsPage.path]: () => this.setPage(SettingsPage),
			[TransactionEditPage.path]: () => this.setPage(TransactionEditPage),
			[TransactionEditPage.pathParams]: (params) => this.setPage(TransactionEditPage, params),
			[TransactionsPage.path]: () => this.setPage(TransactionsPage),
			[TrendsPage.path]: () => this.setPage(TrendsPage),
		})
		.resolve();
		if(!localStorage.getItem(TOUR_VIEWED_KEY)) {
			this.router.navigate(GettingStartedPage.path);
			localStorage.setItem(TOUR_VIEWED_KEY, '1');
		}
	}

	public setPage(page: Page, params: object = {}) {
		this.setState({
			page: page.path,
			params,
		});
		Analytics.logScreenView(page.title, page.path);
	}

	public render() {
		const {
			page,
			params,
		} = this.state;

		const id = params && params.id;

		// TODO dry this up
		return (
			<Provider router={this.router}>
				<App>
					{page === AccountsPage.path &&
						<AccountsPage
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
							key={DailyActivityPage.path}
						/>
					}
					{page === FeedbackPage.path &&
						<FeedbackPage
							key={FeedbackPage.path}
						/>
					}
					{page === GettingStartedPage.path &&
						<GettingStartedPage
							key={GettingStartedPage.path}
						/>
					}
					{page === Help.path &&
						<Help
							key={Help.path}
						/>
					}{page === ProfileManager.path &&
						<ProfileManager
							key={ProfileManager.path}
						/>
					}
					{page === TransactionsPage.path &&
						<TransactionsPage
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
							key={SettingsPage.path}
						/>
					}
					{page === SummaryPage.path &&
						<SummaryPage
							key={SummaryPage.path}
						/>
					}
					{page === TrendsPage.path &&
						<TrendsPage
							key={TrendsPage.path}
						/>
					}
				</App>
			</Provider>
		);
	}
}
