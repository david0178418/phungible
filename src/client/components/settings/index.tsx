import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import BugReport from 'material-ui/svg-icons/action/bug-report';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import Toggle from 'material-ui/Toggle';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import ClearDataPage from '../../pages/clear-data-page';
import Storage from '../../shared/storage';
import {dialogStyles} from '../../shared/styles';
import AppStore from '../../stores/app';
import PinConfirmation from './pin-confirmation';

interface Props {
	appStore?: AppStore;
}

class SettingsStore {
	@observable public confirmPin = false;
	@observable public showDebug = false;
	@observable public isEncrypted: boolean;

	constructor() {
		this.updateEncryption();
	}

	@action public updateEncryption() {
		this.isEncrypted = Storage.isEncrypted();
	}

	@action public openConfirmation() {
		this.confirmPin = true;
	}

	@action public closeConfirmation() {
		this.confirmPin = false;
	}

	@action public closeDebug() {
		this.showDebug = false;
	}

	@action public openDebug() {
		this.showDebug = true;
	}
}

@inject('appStore') @observer
export default
class Settings extends Component<Props, {}> {
	private store: SettingsStore;

	constructor(props: Props) {
		super(props);

		this.store = new SettingsStore();
	}

	public render() {
		const {
			confirmPin,
			isEncrypted,
			showDebug,
		} = this.store;
		return (
			<List>
				<ListItem
					primaryText="Encryption Enabled"
					secondaryText="Warning: Pin will not be recocverable if it is lost"
					rightToggle={<Toggle
						toggled={isEncrypted}
						onToggle={(ev) => this.handleEncryptionToggle()}
					/>}
				/>
				<ListItem primaryText={`Version: ${VERSION}`}/>
				<ListItem
					primaryText="Check for update"
					onTouchTap={() => OfflinePluginRuntime.update()}
				/>
				<ListItem
					primaryText="Debug data"
					onTouchTap={() => this.store.openDebug()}
					rightIcon={<BugReport/>}
				>
					<Dialog
						{...dialogStyles}
						open={showDebug}
						onRequestClose={() => this.store.closeDebug()}
						actions={[
							<FlatButton
								label="Done"
								primary
								onTouchTap={() => this.store.closeDebug()}
							/>,
						]}
					>
						{showDebug && (
							<textarea
								readOnly
								onFocus={(e) => (e.target as any).select()}
								defaultValue={this.props.appStore.debugString()}
								style={{
									height: 200,
									resize: 'none',
									width: '100%',
								}}
							/>
						)}
					</Dialog>
				</ListItem>
				<ListItem
					primaryText="Nuke all data"
					rightIcon={<WarningIcon color="red"/>}
					href={`#${ClearDataPage.path}`}
				/>
				<PinConfirmation
					open={confirmPin}
					onConfirm={(pin) => this.handleSetPin(pin)}
					onCancel={() => this.handleCancelPinConfirmation()}
				/>
			</List>
		);
	}

	private handleEncryptionToggle() {
		if(Storage.isEncrypted()) {
			Storage.disableEncryption();
			this.props.appStore.saveAll();
			this.store.updateEncryption();
		} else {
			this.store.openConfirmation();
		}
	}

	private handleCancelPinConfirmation() {
		this.store.closeConfirmation();
	}

	private handleSetPin(pin: string) {
		Storage.enableEncryption(pin);
		this.props.appStore.saveAll();
		this.store.updateEncryption();
		this.store.closeConfirmation();
	}
}
