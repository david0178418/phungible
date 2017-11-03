import RaisedButton from 'material-ui/RaisedButton';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Profiles from '../../shared/profile-storage';

import AppStore from '../../stores/app';

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
class ProfileManager extends Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	public render() {
		const appStore = this.props.appStore;
		const loggedIn = appStore.isLoggedIn;

		return (
			<div style={style}>
				{appStore.profiles.map((profile) => (
					<div key={profile.id}>
						{(appStore.currentProfile.id === profile.id) ? (
							profile.name
						) : (
							<RaisedButton
								label={profile.name}
								primary={appStore.currentProfile.id === profile.id}
								onClick={() => {/**/}}
							/>
						)}
						{loggedIn && (appStore.currentProfile.id === profile.id) && (
							<RaisedButton
								label="Sync"
								onClick={() => Profiles.sync()}
							/>
						)}
						<RaisedButton
							label="Create"
							onClick={() => {/**/}}
						/>
					</div>
				))}
			</div>
		);
	}
}
