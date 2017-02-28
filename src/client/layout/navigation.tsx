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

export default
class Navigation extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	public render() {
		const store = this.props.store;
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
						containerElement={<Link to="/accounts" />}
						rightIcon={<Badge badgeContent={store.accounts.length} primary={true} />}
					>
						Accounts
					</MenuItem>
					<MenuItem
						containerElement={<Link to="/scheduled-transactions" />}
						rightIcon={<Badge badgeContent={store.scheduledTransactions.length} primary={true} />}
					>
						Budget
					</MenuItem>
					<MenuItem
						containerElement={<Link to="/transactions" />}
						rightIcon={<Badge badgeContent={store.transactions.length} primary={true} />}
					>
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
