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
		return (
			<AppBar
				className="app-title"
				onLeftIconButtonTouchTap={() => this.handleDrawerStateUpdate(true)}
				title={this.props.title}
			>
				<Drawer
					containerClassName="app-title"
					docked={false}
					open={this.state.isOpen}
					onRequestChange={(open) => this.handleDrawerStateUpdate(open)}
				>
					<AppBar iconElementLeft={<span/>} title="Phungible"/>
					<NavItem
						leftIcon={<DateRangeIcon />}
						href={`${DailyActivityPage.path}`}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Daily Activity
					</NavItem>
					<NavItem
						{...trendsProps(accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Trends
					</NavItem>
					<NavItem
						href={accountTarget(accounts.length)}
						leftIcon={<AccountBalanceIcon />}
						rightIcon={<Badge badgeContent={accounts.length} primary />}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Accounts
					</NavItem>
					<NavItem
						{...budgetProps(budgets.length, accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						{BudgetsPage.title}
					</NavItem>
					<NavItem
						{...scheduledTransactionProps(scheduledTransactions.length, accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						{ScheduledTransactionsPage.title}
					</NavItem>
					<NavItem
						{...transactionProps(transactions.length, accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Transactions
					</NavItem>
					<NavItem
						leftIcon={<HelpIcon />}
						href={`${Help.path}`}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						{Help.title}
					</NavItem>
					<NavItem
						href={SettingsPage.path}
						leftIcon={<SettingsIcon/>}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
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
