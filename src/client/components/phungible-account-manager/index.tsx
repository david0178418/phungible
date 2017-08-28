import RaisedButton from 'material-ui/RaisedButton';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import { AddIcon } from '../../shared/shared-components';

import AppStore from '../../stores/app';

const {Component} = React;

interface Props {
	appStore?: AppStore;
}

class PhungibleAccountManagerStore {
}

@inject('appStore') @observer
export default
class Settings extends Component<Props, {}> {
	private store: PhungibleAccountManagerStore;

	constructor(props: Props) {
		super(props);

		this.store = new PhungibleAccountManagerStore();
	}

	public render() {
		return (
			<div>
				<RaisedButton
					primary
					icon={<AddIcon/>}
					label="Create Account"
				/>
			</div>
		);
	}
}
