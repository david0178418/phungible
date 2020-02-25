import {ListItem} from 'material-ui/List';
import * as React from 'react';
import { TypeIcon } from '../../shared/shared-components';

import Transaction from '../../stores/transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

type ActivityItemProps = {
	transaction: Transaction;
	onRemove: (transaction: Transaction) => void;
};

export default
function ActivityItem({transaction, onRemove}: ActivityItemProps) {
	let rightIconButton;
	let secondaryText = transaction.name;

	if(transaction.id) {
		rightIconButton = EditRemoveMenu<Transaction>('transaction', transaction, onRemove);
	} else {
		secondaryText += ' (pending)';
	}

	return (
		<ListItem
			primaryText={`${transaction.amount.valFormatted}`}
			secondaryText={secondaryText}
			rightIconButton={rightIconButton}
			leftIcon={<TypeIcon type={transaction.transactionType}/>}
		/>
	);
}
