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
	let href = '';

	if(transaction.id) {
		rightIconButton = EditRemoveMenu<Transaction>(Transaction.type, transaction, onRemove);
		href = `#/${Transaction.type}/edit/${transaction.id}`;
	} else {
		secondaryText += ' (pending)';
	}

	return (
		<ListItem
			primaryText={`${transaction.amount.valFormatted}`}
			secondaryText={secondaryText}
			rightIconButton={rightIconButton}
			href={href}
			leftIcon={<TypeIcon type={transaction.transactionType}/>}
		/>
	);
}
