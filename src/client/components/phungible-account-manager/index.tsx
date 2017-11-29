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

const style = {
	textAlign: 'center',
};

@inject('appStore') @observer
export default
class PhungibleAccountManager extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			loading: false,
		};
	}

	public render() {
		const appStore = this.props.appStore;

		return (
			<div style={style}>
				{appStore.isConnected ? (
					<div>
						<LoggedIn
							username={appStore.username}
							onLogout={() => appStore.logout()}
						/>
						<div>
							{this.state.loading && 'Syncing'}
						</div>
					</div>
				) : (
					<SignUpForm
						username={appStore.username}
						onLogin={(e) => appStore.login(e)}
						onCreation={(e) => appStore.login(e)}
					/>
				)}
			</div>
		);
	}
}
