import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import Toggle from 'material-ui/Toggle';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import ClearDataPage from '../../pages/clear-data-page';
import Storage from '../../shared/storage';
import AppStore from '../../stores/app';
import PinConfirmation from './pin-confirmation';

interface Props {
	store?: AppStore;
}

class SettingsStore {
	@observable public confirmPin = false;
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
}

@observer
export default
class Settings extends Component<Props, {}> {
	private store: SettingsStore;

	constructor(props: Props) {
		super(props);

		this.store = new SettingsStore();
	}

	public render() {
		return (
			<List>
				<ListItem
					primaryText="Encryption Enabled"
					secondaryText="Warning: Pin will not be recocverable if it is lost"
					rightToggle={<Toggle
						toggled={this.store.isEncrypted}
						onToggle={(ev) => this.handleEncryptionToggle()}
					/>}
				/>
				<Divider/>
				<ListItem
					primaryText="Nuke all data"
					rightIcon={<WarningIcon color="red"/>}
					href={`#${ClearDataPage.path}`}
				/>
				<PinConfirmation
					open={this.store.confirmPin}
					onConfirm={(pin) => this.handleSetPin(pin)}
					onCancel={() => this.handleCancelPinConfirmation()}
				/>
			</List>
		);
	}

	private handleEncryptionToggle() {
		if(Storage.isEncrypted()) {
			Storage.disableEncryption();
			this.props.store.saveAll();
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
		this.props.store.saveAll();
		this.store.updateEncryption();
		this.store.closeConfirmation();
	}
}
