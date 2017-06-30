import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Storage from '../../shared/storage';
import AppStore from '../../stores/app';

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
class FeedbackForm extends Component<Props, {}> {
	private store: SettingsStore;

	constructor(props: Props) {
		super(props);

		this.store = new SettingsStore();
	}

	public render() {
		return (
			<form>
				1234321
			</form>
		);
	}
}
