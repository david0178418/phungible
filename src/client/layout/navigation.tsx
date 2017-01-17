import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';
import {browserHistory} from 'react-router';

export default
class Navigation extends React.Component<any, any> {
	constructor(props: any) {
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
				title="Budget Tool"
			>
				<Drawer
					containerClassName="app-title"
					docked={false}
					open={this.state.isOpen}
					onRequestChange={() => this.handleDrawerToggle()}
				>
					<MenuItem onTouchTap={() => this.handleNavigateTo('/accounts')}>
						Accounts
					</MenuItem>
					<MenuItem onTouchTap={() => this.handleNavigateTo('/overview')}>
						Budget Entries
					</MenuItem>
				</Drawer>
			</AppBar>
		);
	}

	private handleNavigateTo(location: string) {
		browserHistory.push(location);
		this.handleDrawerToggle();
	}

	private handleDrawerToggle() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}
}
