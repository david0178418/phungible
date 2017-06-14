import {inject, observer} from 'mobx-react';
import * as React from 'react';

import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import ScheduledTransactionEdit from '../scheduled-transaction-edit';
import ScheduledTransactionsList from '../scheduled-transactions-list';
import CreateItemStep from './create-item-step';

interface Props {
	items: ScheduledTransaction[];
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
					typeName="Budget"
					modelClass={ScheduledTransaction}
					listComponent={ScheduledTransactionsList}
					editComponent={ScheduledTransactionEdit}
					listComponentProps={{
						isBudget: true,
					}}
					editComponentProps={{
						accounts: appStore.accounts,
						isBudget: true,
					}}
				/>
			</div>
		);
	}
}
