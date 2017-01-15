import {AppBar, FloatingActionButton, IconButton} from 'material-ui';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {browserHistory} from 'react-router';

import AppStore from '../../shared/stores/app';
import BudgetEntry from '../../shared/stores/budget-entry';
import BudgetEntryEdit from '../budget-entry-edit';

class CreateBudgetEntryStore {
	public budgetEntry: BudgetEntry;
	public appStore: AppStore;

	constructor(appStore: AppStore, budgetEntryId?: number) {
		this.appStore = appStore;

		if(budgetEntryId) {
			this.budgetEntry = appStore.findBudgetEntry(budgetEntryId);
		} else {
			this.budgetEntry = new BudgetEntry();
		}
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

	get accounts() {
		return this.appStore.accounts;
	}
}
type Props = {
	store: AppStore;
	params: {
		id: number;
	};
};

@observer
export default
class CreateBudgetEntry extends Component<Props, any> {
	private store: CreateBudgetEntryStore;

	constructor(props: Props) {
		super(props);
		this.store = new CreateBudgetEntryStore(props.store, +props.params.id);
	}

	public render() {
		const {
			budgetEntry,
		} = this.store;
		const action = budgetEntry.id ? 'Edit' : 'Create';

		return (
			<div>
				<AppBar
					className="app-title"
					onLeftIconButtonTouchTap={() => browserHistory.goBack()}
					title={`${action} Budget Entry`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<BudgetEntryEdit
					accounts={this.store.accounts}
					appStore={this.store.appStore}
					budgetEntry={this.store.budgetEntry}
					onSubmit={() => this.handleSaveBudgetEntry()}
				/>
				<FloatingActionButton
					disabled={!budgetEntry.isValid}
					onTouchTap={() => this.handleSaveBudgetEntry()}
					zDepth={2}
				>
					<ActionDone />
				</FloatingActionButton>
			</div>
		);
	}

	private handleSaveBudgetEntry() {
		this.store.saveBudgetEntry();
		browserHistory.push('/overview');
	}
}
