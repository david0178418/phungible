import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Drawer from 'material-ui/Drawer';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance';
import WalletIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import CompareIcon from 'material-ui/svg-icons/action/compare-arrows';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import HelpIcon from 'material-ui/svg-icons/action/help';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up';
import RepeatIcon from 'material-ui/svg-icons/av/repeat';
import {inject} from 'mobx-react';
import * as React from 'react';
import {
	AccountEditPage,
	AccountsPage,
	BudgetEditPage,
	BudgetsPage,
	DailyActivityPage,
	FeedbackPage,
	Help,
	ScheduledTransactionEditPage,
	ScheduledTransactionsPage,
	SettingsPage,
	TransactionEditPage,
	TransactionsPage,
	TrendsPage,
} from '../pages';
import AppStore from '../stores/app';
import NavItem from './nav-item';

type Props = {
	appStore?: AppStore;
	title: string;
	iconElementRight?: JSX.Element;
};

type MenuItemProps = any;

function accountTarget(accountsCount: number) {
	return accountsCount ? AccountsPage.path : AccountEditPage.path;
}

function budgetProps(budgetsCount: number, accountCount: number) {
	const props: MenuItemProps = {
		leftIcon: <WalletIcon />,
		rightIcon: <Badge badgeContent={budgetsCount} primary />,
	};

	if(accountCount) {
		props.href = budgetsCount ? BudgetsPage.path : BudgetEditPage.path;
	} else {
		props.disabled = true;
	}

	return props;
}

function scheduledTransactionProps(scheduledTransactionsCount: number, accountCount: number) {
	const props: MenuItemProps = {
		leftIcon: <RepeatIcon />,
		rightIcon: <Badge badgeContent={scheduledTransactionsCount} primary />,
	};

	if(accountCount) {
		props.href = scheduledTransactionsCount ? ScheduledTransactionsPage.path : ScheduledTransactionEditPage.path;
	} else {
		props.disabled = true;
	}

	return props;
}

function transactionProps(transactionsCount: number, accountsCount: number) {
	const props: MenuItemProps = {
		leftIcon: <CompareIcon />,
	};

	if(accountsCount) {
		props.href = transactionsCount ? TransactionsPage.path : TransactionEditPage.path;
	} else {
		props.disabled = true;
	}

	return props;
}

function trendsProps(accountsCount: number) {
	const props: MenuItemProps = {
		leftIcon: <TrendingUpIcon />,
	};

	if(accountsCount) {
		props.href = TrendsPage.path;
	} else {
		props.disabled = true;
	}

	return props;
}

@inject('appStore')
export default
class Navigation extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	// TODO dry this up
	public render() {
		const {
			accounts,
			budgets,
			scheduledTransactions,
			transactions,
		} = this.props.appStore;
		const appBarProps: Partial<Props> = {};

		if(this.props.iconElementRight) {
			appBarProps.iconElementRight = this.props.iconElementRight;
		}
		return (
			<AppBar
				{...appBarProps}
				className="app-title"
				onLeftIconButtonTouchTap={() => this.handleDrawerStateUpdate(true)}
				title={this.props.title}
			>
				<Drawer
					containerClassName="app-title"
					docked={false}
					open={this.state.isOpen}
					onRequestChange={(isOpen) => this.handleDrawerStateUpdate(isOpen)}
				>
					<AppBar
						title="Phungible"
						iconStyleLeft={{
							marginTop: 12,
						}}
						iconElementLeft={(
							<img src="images/icons/icon-32x32.png" />
						)}
					/>
					<NavItem
						leftIcon={<DateRangeIcon />}
						href={`${DailyActivityPage.path}`}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						Daily Activity
					</NavItem>
					<NavItem
						{...trendsProps(accounts.length)}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						Trends
					</NavItem>
					<NavItem
						href={accountTarget(accounts.length)}
						leftIcon={<AccountBalanceIcon />}
						rightIcon={<Badge badgeContent={accounts.length} primary />}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						Accounts
					</NavItem>
					<NavItem
						{...budgetProps(budgets.length, accounts.length)}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						{BudgetsPage.title}
					</NavItem>
					<NavItem
						{...scheduledTransactionProps(scheduledTransactions.length, accounts.length)}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						{ScheduledTransactionsPage.title}
					</NavItem>
					<NavItem
						{...transactionProps(transactions.length, accounts.length)}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						Transactions
					</NavItem>
					<NavItem
						leftIcon={<HelpIcon />}
						href={`${Help.path}`}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						{Help.title}
					</NavItem>
					<NavItem
						leftIcon={<FeedbackPage.icon />}
						href={FeedbackPage.path}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						{FeedbackPage.title}
					</NavItem>
					<NavItem
						href={SettingsPage.path}
						leftIcon={<SettingsIcon/>}
						onClick={() => this.handleDrawerStateUpdate(false)}
					>
						{SettingsPage.title}
					</NavItem>
				</Drawer>
			</AppBar>
		);
	}

	private handleDrawerStateUpdate(isOpen: boolean) {
		this.setState({
			isOpen,
		});
	}
}
