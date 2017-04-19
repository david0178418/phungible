import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Drawer from 'material-ui/Drawer';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance';
import AccountBalanceWalletIcon from 'material-ui/svg-icons/action/account-balance-wallet';
import CompareIcon from 'material-ui/svg-icons/action/compare-arrows';
import HomeIcon from 'material-ui/svg-icons/action/home';
import TrendingUpIcon from 'material-ui/svg-icons/action/trending-up';
import * as React from 'react';

import AccountEdit from '../components/account-edit';
import Accounts from '../components/accounts';
import CreateScheduledTransaction from '../components/create-scheduled-transaction';
import Home from '../components/home';
import ScheduledTransactions from '../components/schduled-transactions';
import TransactionEdit from '../components/transaction-edit/';
import Transactions from '../components/transactions';
import Trends from '../components/trends';
import AppStore from '../shared/stores/app';
import NavItem from './nav-item';

type Props = {
	title: string;
	store: AppStore;
};

type MenuItemProps = any;

function accountTarget(accountsCount: number) {
	return accountsCount ? Accounts.path : AccountEdit.path;
}

function budgetProps(scheduledTransactionsCount: number, accountCount: number) {
	const props: MenuItemProps = {
		leftIcon: <AccountBalanceWalletIcon />,
		rightIcon: <Badge badgeContent={scheduledTransactionsCount} primary />,
	};

	if(accountCount) {
		props.href = scheduledTransactionsCount ? ScheduledTransactions.path : CreateScheduledTransaction.path;
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
		props.href = transactionsCount ? Transactions.path : TransactionEdit.path;
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
						href={`${Home.path}`}
						onTouchTap={() => this.handleDrawerStateUpdate(false)}
					>
						Home
					</NavItem>
					<NavItem
						href={Trends.path}
						leftIcon={<TrendingUpIcon />}
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
