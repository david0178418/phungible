import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';
import {Link} from 'react-router';

import AppStore from '../shared/stores/app';

type Props = {
	title: string;
	store: AppStore;
};

type MenuItemProps = {
	containerElement?: React.ReactElement<any>;
	disabled?: boolean;
	rightIcon: React.ReactElement<any>;
};

function accountTarget(accountsCount: number) {
	return accountsCount ? '/accounts' : '/account/edit';
}

function budgetProps(scheduledTransactionsCount: number, accountCount: number) {
	const props: MenuItemProps = {
		rightIcon: <Badge badgeContent={scheduledTransactionsCount} primary={true} />,
	};

	if(accountCount) {
		props.containerElement = <Link to={
			scheduledTransactionsCount ? '/scheduled-transactions' : '/scheduled-transaction/edit'
		} />;
	} else {
		props.disabled = true;
	}

	return props;
}

function transactionProps(transactionsCount: number, accountsCount: number) {
	const props: MenuItemProps = {
		rightIcon: <Badge badgeContent={transactionsCount} primary={true} />,
	};

	if(accountsCount) {
		props.containerElement = <Link to={
			transactionsCount ? '/transactions' : '/transaction/edit'
		} />;
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
				onLeftIconButtonTouchTap={() => this.handleDrawerToggle()}
				title={this.props.title}
			>
				<Drawer
					containerClassName="app-title"
					docked={false}
					open={this.state.isOpen}
					onRequestChange={() => this.handleDrawerToggle()}
				>
					<MenuItem containerElement={<Link to="/" />}>
						Trends
					</MenuItem>
					<MenuItem
						containerElement={<Link to={accountTarget(accounts.length)} />}
						rightIcon={<Badge badgeContent={accounts.length} primary={true} />}
					>
						Accounts
					</MenuItem>
					<MenuItem {...budgetProps(scheduledTransactions.length, accounts.length)}>
						Budget
					</MenuItem>
					<MenuItem {...transactionProps(transactions.length, accounts.length)}>
						Transactions
					</MenuItem>
				</Drawer>
			</AppBar>
		);
	}

	private handleDrawerToggle() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}
}
