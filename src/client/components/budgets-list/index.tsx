import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {observer} from 'mobx-react';
import * as React from 'react';

import {AddIcon} from '../../shared/shared-components';
import AppStore from '../../stores/app';
import Budget from '../../stores/budget';
import EditRemoveMenu from '../shared/edit-remove-menu';

const {Component} = React;

type Props = {
	store: AppStore;
	items: Budget[];
	showCreate?: boolean;
	onEdit?: (budget: Budget) => void;
	onOpenCreate?: () => void;
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
			showCreate,
			onOpenCreate,
		} = this.props;
		return (
			<List>
				{showCreate && (
					<ListItem
						rightIcon={
							<AddIcon/>
						}
						onClick={onOpenCreate}
						primaryText="Create Budget"
					/>
				)}
				{!showCreate && !items.length && (
					<ListItem
						primaryText="No budget available"
					/>
				)}
				{items.map((budget) => (
					<ListItem
						key={budget.id}
						primaryText={`${budget.amount.valFormatted} ${budget.name}`}
						secondaryText={`Current Remaining: ${store.currentProfile.findRemainingBudgetBalance(budget.id).valFormatted}`}
						rightIconButton={EditRemoveMenu<Budget>('budget', budget, onRemove)}
					/>
				))}
			</List>
		);
	}
}
