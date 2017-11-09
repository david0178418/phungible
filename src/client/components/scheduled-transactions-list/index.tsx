
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {observer} from 'mobx-react';
import * as React from 'react';

import {TransactionType} from '../../constants';
import {AddIcon, ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

const {Component} = React;

type Props = {
	store: AppStore;
	showCreate?: boolean;
	isBudget?: boolean;
	items: ScheduledTransaction[];
	onEdit?: (scheduledTransaction: ScheduledTransaction) => void;
	onOpenCreate?: () => void;
	onRemove: (scheduledTransaction: ScheduledTransaction) => void;
};

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const {
			onRemove,
			items,
			isBudget,
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
						primaryText={`Create ${isBudget ? 'Budget' : 'Recurring Transaction'}`}
					/>
				)}
				{!showCreate && !items.length && (
					<ListItem
						primaryText={`No ${isBudget ? 'budget' : 'recurring transaction'} available`}
					/>
				)}
				{items.map((scheduledTransaction) => (
					<ListItem
						key={scheduledTransaction.id}
						primaryText={`${scheduledTransaction.name}`}
						secondaryText={`Amount: ${scheduledTransaction.amount.valFormatted}`}
						leftIcon={
							scheduledTransaction.transactionType === TransactionType.Income ?
								<IncomeIcon/> :
								<ExpenseIcon/>
						}
						rightIconButton={EditRemoveMenu<ScheduledTransaction>(
							'scheduled-transaction',
							scheduledTransaction,
							onRemove,
							(this.props.onEdit ? () => this.props.onEdit(scheduledTransaction) : undefined),
						)}
					/>
				))}
			</List>
		);
	}
}
