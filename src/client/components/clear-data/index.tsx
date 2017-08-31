import Button from 'material-ui/Button';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import {inject} from 'mobx-react';
import * as React from 'react';

import SettingsPage from '../../pages/settings-page';
import AppStore from '../../stores/app';

const {Component} = React;

type Props = {
	appStore?: AppStore;
	router?: Navigo;
};

@inject('appStore', 'router')
export default
class ClearData extends Component<Props, {}> {
	public render() {
		return (
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<p>
					Are you sure?  The data will <strong>not</strong> be recoverable.
				</p>
				<div>
					<Button
						fab
						color="accent"
						style={{
							marginTop: '75px',
						}}
						onClick={() => this.handleClearData()}
					>
						<WarningIcon/>
					</Button>
				</div>
			</div>
		);
	}

	private routeBack() {
		this.props.router.navigate(SettingsPage.path);
	}

	private handleClearData() {
		this.props.appStore.clearAllData();
		this.routeBack();
	}
}
