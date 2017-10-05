import { inject, observer } from 'mobx-react';
import * as React from 'react';

import AppStore from '../../stores/app';
import LoggedIn from './logged-in';
import SignUpForm from './sign-up-form';

const {Component} = React;

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
class PhungibleAccountManager extends Component<Props, {}> {
	private store: PhungibleAccountManagerStore;

	constructor(props: Props) {
		super(props);

		this.store = new PhungibleAccountManagerStore();
	}

	public render() {
		const appStore = this.props.appStore;

		return (
			<p style={style}>
				{appStore.isLoggedIn ? (
					<LoggedIn
						email={appStore.email}
						onLogout={() => appStore.handleLogout()}
					/>
				) : (
					<SignUpForm
						email={appStore.email}
						onLogin={(e) => appStore.handleLogin(e)}
						onCreation={(e) => appStore.handleLogin(e)}
					/>
				)}
			</p>
		);
	}
}
