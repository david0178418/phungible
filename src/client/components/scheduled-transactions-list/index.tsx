
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {observer} from 'mobx-react';
import * as React from 'react';

import {AddIcon, TypeIcon} from '../../shared/shared-components';
import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

const {Component} = React;

type Props = {
	store: AppStore;
	showCreate?: boolean;
	items: ScheduledTransaction[];
	onEdit?: (scheduledTransaction: ScheduledTransaction) => void;
	onOpenCreate?: () => void;
	onRemove: (scheduledTransaction: ScheduledTransaction) => void;
};

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.currentProfile.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const {
			onEdit,
			onRemove,
			items,
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
						primaryText="Create Recurring Transaction"
					/>
				)}
				{!showCreate && !items.length && (
					<ListItem
						primaryText="No recurring transaction available"
					/>
				)}
				{items.map((scheduledTransaction) => {
					return <ListItem
						key={scheduledTransaction.id}
						primaryText={`${scheduledTransaction.name}`}
						secondaryText={`Amount: ${scheduledTransaction.amount.valFormatted}`}
						leftIcon={<TypeIcon type={scheduledTransaction.transactionType}/>}
						onClick={() => onEdit && onEdit(scheduledTransaction)}
						href={!onEdit ? `#/${ScheduledTransaction.type}/edit/${scheduledTransaction.id}` : ''}
						rightIconButton={EditRemoveMenu<ScheduledTransaction>(
							ScheduledTransaction.type,
							scheduledTransaction,
							onRemove,
							(this.props.onEdit ? () => this.props.onEdit(scheduledTransaction) : undefined),
						)}
					/>;
				})}
			</List>
		);
	}
}
