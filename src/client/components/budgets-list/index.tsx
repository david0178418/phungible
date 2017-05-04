import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	store: AppStore;
	budgets: ScheduledTransaction[];
	onRemove: (budget: ScheduledTransaction) => void;
};

class BudgetsStore {
	public appStore: AppStore;

	@observable private _openBudget: ScheduledTransaction;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
	}

	@action public closeOpenBudget() {
		this._openBudget = null;
	}
	@action public createBudget() {
		this._openBudget = new ScheduledTransaction();
	}
	@action public saveBudget() {
		this.appStore.saveBudget(this._openBudget);
		this.closeOpenBudget();
	}
	@action public editBudget(budget: ScheduledTransaction) {
		this._openBudget = ScheduledTransaction.clone(budget);
	}
	@action public removeBudget(budget: ScheduledTransaction) {
		this._openBudget = ScheduledTransaction.clone(budget);
	}
	@computed get budgets() {
		return this.appStore.budgets;
	}
	@computed get isOpen() {
		return !!this._openBudget;
	}
	get openBudget(): ScheduledTransaction {
		return this._openBudget;
	}
}

@observer
export default
class BudgetsList extends Component<Props, {}> {
	private store: BudgetsStore;

	constructor(props: Props) {
		super(props);
		this.store = new BudgetsStore(props.store);
	}

	public render() {
		const {onRemove, budgets} = this.props;
		return (
			<List>
				{budgets.map((budget) => (
					<ListItem
						key={budget.id}
						primaryText={`${budget.amount.valFormatted}`}
						secondaryText={`${budget.name}`}
						rightIconButton={EditRemoveMenu<ScheduledTransaction>('budget', budget, onRemove)}
					/>
				))}
			</List>
		);
	}
}
