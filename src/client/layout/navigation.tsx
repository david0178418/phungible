import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';
import {Link} from 'react-router';

type Props = {
	title: string;
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
					<MenuItem containerElement={<Link to="/accounts" />}>
						Accounts
					</MenuItem>
					<MenuItem containerElement={<Link to="/scheduled-transactions" />}>
						Budget
					</MenuItem>
					<MenuItem containerElement={<Link to="/transactions" />}>
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
