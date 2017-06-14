import {inject, observer} from 'mobx-react';
import * as React from 'react';

import Account from '../../stores/account';
import AppStore from '../../stores/app';
import AccountEdit from '../account-edit';
import AccountsList from '../accounts-list';
import CreateItemStep from './create-item-step';

interface Props {
	items: Account[];
	appStore?: AppStore;
}

@inject('appStore') @observer
export default
class CreateAccountsStep extends React.Component<Props, {}> {

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {
			items,
			appStore,
		} = this.props;
		return (
			<div>
				<CreateItemStep
					appStore={appStore}
					items={items}
					typeName="Account"
					modelClass={Account}
					listComponent={AccountsList}
					editComponent={AccountEdit}
				/>
			</div>
		);
	}
}
