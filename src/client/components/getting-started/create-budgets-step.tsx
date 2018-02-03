import {inject, observer} from 'mobx-react';
import * as React from 'react';

import BudgetEditPage from '../../pages/budget-edit-page';
import AppStore from '../../stores/app';
import Budget from '../../stores/budget';
import BudgetsList from '../budgets-list';
import CreateItemStep from './create-item-step';

interface Props {
	items: Budget[];
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
					modelClass={Budget}
					listComponent={BudgetsList}
					editComponent={BudgetEditPage}
					listComponentProps={{
						isBudget: true,
					}}
					editComponentProps={{
						accounts: appStore.currentProfile.accounts,
						isBudget: true,
					}}
				/>
			</div>
		);
	}
}
