import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {Button} from 'reactstrap';

import Icon from '../../shared/icon';
import AppStore from '../../shared/stores/app';
import BudgetEntry from '../../shared/stores/budget-entry';
import BudgetEntryEdit from '../budget-entry-edit';

class CreateBudgetEntryStore {
	public budgetEntry: BudgetEntry;
	public appStore: AppStore;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
		this.budgetEntry = new BudgetEntry();
	}

	public saveBudgetEntry() {
		if(this.budgetEntry.isValid) {
			this.appStore.saveBudgetEntry(this.budgetEntry);
			this.budgetEntry = new BudgetEntry();
			return true;
		} else {
			return false;
		}
	}
}
type Props = {
	store: AppStore;
};

@observer
export default
class CreateBudgetEntry extends Component<Props, any> {
	private store: CreateBudgetEntryStore;

	constructor(props: Props) {
		super(props);
		this.store = new CreateBudgetEntryStore(props.store);
	}

	public render() {
		const {
			budgetEntry,
		} = this.store;

		return (
			<div>
				<h2>Create Budget Entry</h2>
				<BudgetEntryEdit
					budgetEntry={this.store.budgetEntry}
					onSubmit={() => this.store.saveBudgetEntry()}
				/>
				<Button color="primary" disabled={!budgetEntry.isValid} onClick={() => this.store.saveBudgetEntry()}>
					<Icon type="plus" />
					{' Add Entry'}
				</Button>
			</div>
		);
	}
}
