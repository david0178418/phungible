import RaisedButton from 'material-ui/RaisedButton';
import * as React from 'react';

import { logout } from '../../shared/api';

const { Component } = React;

interface LoggedInProps {
	email: string;
	onLogout(): void;
}

export default
class LoggedIn extends Component<LoggedInProps, {}> {
	public render() {
		return (
			<div>
				Logged in as {this.props.email}
				<div>
					<RaisedButton
						primary
						label="Sign Out"
						onClick={() => this.handleLogout()}
					/>
				</div>
			</div>
		);
	}

	private async handleLogout() {
		await logout();
		this.props.onLogout();
	}
}
