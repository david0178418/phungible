import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

import AppStore from '../../stores/app';
import Budget from '../../stores/budget';
import EditRemoveMenu from '../shared/edit-remove-menu';

const {Component} = React;

type Props = {
	store: AppStore;
	budgets: Budget[];
	onRemove: (budget: Budget) => void;
};

class BudgetsStore {
	public appStore: AppStore;

	@observable private _openBudget: Budget;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
	}

	@action public closeOpenBudget() {
		this._openBudget = null;
	}
	@action public createBudget() {
		this._openBudget = new Budget();
	}
	@action public saveBudget() {
		this.appStore.saveBudget(this._openBudget);
		this.closeOpenBudget();
	}
	@action public async editBudget(budget: Budget) {
		this._openBudget = await Budget.clone(budget) as any;
	}
	@action public async removeBudget(budget: Budget) {
		this._openBudget = await Budget.clone(budget) as any;
	}
	@computed get budgets() {
		return this.appStore.budgets;
	}
	@computed get isOpen() {
		return !!this._openBudget;
	}
	get openBudget(): Budget {
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
		const {
			budgets,
			onRemove,
			store,
		} = this.props;
		return (
			<List>
				{budgets.map((budget) => (
					<ListItem
						key={budget.id}
						primaryText={`${budget.amount.valFormatted} ${budget.name}`}
						secondaryText={`Current Remaining: ${store.findRemainingBudgetBalance(budget.id).valFormatted}`}
						rightIconButton={EditRemoveMenu<Budget>('budget', budget, onRemove)}
					/>
				))}
				{!budgets.length && (
					<ListItem
						primaryText="No budgets available"
					/>
				)}
			</List>
		);
	}
}
