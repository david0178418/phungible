import { inject, observer } from 'mobx-react';
import * as React from 'react';

import AppStore from '../../stores/app';
import LoggedIn from './logged-in';
import SignUpForm from './sign-up-form';

const {Component} = React;

interface State {
	loading: boolean;
}

interface Props {
	appStore?: AppStore;
}

class PhungibleAccountManagerStore {
}

const style = {
	textAlign: 'center',
};

@inject('appStore') @observer
export default
class PhungibleAccountManager extends Component<Props, State> {
	private store: PhungibleAccountManagerStore;

	constructor(props: Props) {
		super(props);

		this.store = new PhungibleAccountManagerStore();
		this.state = {
			loading: false,
		};
	}

	public render() {
		const appStore = this.props.appStore;

		return (
			<div style={style}>
				{appStore.isLoggedIn ? (
					<div>
						<LoggedIn
							username={appStore.username}
							onLogout={() => appStore.handleLogout()}
						/>
						<div>
							{this.state.loading && 'Syncing'}
						</div>
					</div>
				) : (
					<SignUpForm
						username={appStore.username}
						onLogin={(e) => appStore.handleLogin(e)}
						onCreation={(e) => appStore.handleLogin(e)}
					/>
				)}
			</div>
		);
	}
}
