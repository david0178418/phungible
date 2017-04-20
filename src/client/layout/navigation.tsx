import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Drawer from 'material-ui/Drawer';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance';
import AccountBalanceWalletIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import CompareIcon from 'material-ui/svg-icons/action/compare-arrows';
import HomeIcon from 'material-ui/svg-icons/action/home';
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up';
import * as React from 'react';
import {
	AccountEditPage,
	AccountsPage,
	HomePage,
	ScheduledTransactionEditPage,
	ScheduledTransactionsPage,
	TransactionEditPage,
	TransactionsPage,
	TrendsPage,
} from '../components/pages';
import AppStore from '../shared/stores/app';
import NavItem from './nav-item';

type Props = {
	store?: AppStore;
	title: string;
};

type MenuItemProps = any;

function accountTarget(accountsCount: number) {
	return accountsCount ? AccountsPage.path : AccountEditPage.path;
}

function budgetProps(scheduledTransactionsCount: number, accountCount: number) {
	const props: MenuItemProps = {
		leftIcon: <AccountBalanceWalletIcon />,
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
		rightIcon: <Badge badgeContent={transactionsCount} primary />,
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

export default
class Navigation extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	public render() {
		const {accounts, scheduledTransactions, transactions} = this.props.store;
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
					<NavItem
						leftIcon={<HomeIcon />}
						href={`${HomePage.path}`}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Home
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
						{...budgetProps(scheduledTransactions.length, accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Budget
					</NavItem>
					<NavItem
						{...transactionProps(transactions.length, accounts.length)}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Transactions
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
