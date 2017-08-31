import {inject, observer} from 'mobx-react';
import * as React from 'react';

import AppStore from '../../stores/app';
import SignupForm from './signup-form';

const {Component} = React;

interface Props {
	appStore?: AppStore;
}

class PhungibleAccountManagerStore {
}

@inject('appStore') @observer
export default
class PhungibleAccountManager extends Component<Props, {}> {
	private store: PhungibleAccountManagerStore;

	constructor(props: Props) {
		super(props);

		this.store = new PhungibleAccountManagerStore();
	}

	public render() {
		return (
			<div>
				<SignupForm
					onSubmit={() => {/**/}}
				/>
			</div>
		);
	}
}
