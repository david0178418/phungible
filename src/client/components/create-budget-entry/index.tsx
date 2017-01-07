import {Component} from 'react';
import * as React from 'react';
import {serialize} from 'serializr';
import {setItem} from '../../global/storage';

import {AppStore, BudgetEntry} from '../../global/types';
import BudgetEntryEdit from '../budget-entry-edit';

type Props = {
	store: AppStore;
};

export default
class CreateBudgetEntry extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div>
				<h2>Create Budget Entry</h2>
				<BudgetEntryEdit onSubmit={(newBudgetEntry) => this.onSubmit(newBudgetEntry)} />
			</div>
		);
	}

	private onSubmit(newBudgetEntry: BudgetEntry) {
		this.props.store.budgetEntries.push(newBudgetEntry);
		setItem('store', serialize(this.props.store));
	}
}
