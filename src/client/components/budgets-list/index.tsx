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
	items: Budget[];
	onRemove: (budget: Budget) => void;
};

@observer
export default
class BudgetsList extends Component<Props, {}> {
	public render() {
		const {
			items,
			onRemove,
			store,
		} = this.props;
		return (
			<List>
				{items.map((budget) => (
					<ListItem
						key={budget.id}
						primaryText={`${budget.amount.valFormatted} ${budget.name}`}
						secondaryText={`Current Remaining: ${store.currentProfile.findRemainingBudgetBalance(budget.id).valFormatted}`}
						rightIconButton={EditRemoveMenu<Budget>('budget', budget, onRemove)}
					/>
				))}
				{!items.length && (
					<ListItem
						primaryText="No budgets available"
					/>
				)}
			</List>
		);
	}
}
