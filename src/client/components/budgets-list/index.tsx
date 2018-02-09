import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
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

@observer
export default
class BudgetsList extends Component<Props, {}> {
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
						secondaryText={`Current Remaining: ${store.currentProfile.findRemainingBudgetBalance(budget.id).valFormatted}`}
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
