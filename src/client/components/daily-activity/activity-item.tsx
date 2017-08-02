import {ListItem} from 'material-ui/List';
import ActionTrendingDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ActionTrendingUp from 'material-ui/svg-icons/navigation/arrow-upward';
import * as React from 'react';

import Colors from '../../shared/colors';
import {TransactionType} from '../../stores/transaction';
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
			leftIcon={
				transaction.transactionType === TransactionType.Income ?
					<ActionTrendingUp color={Colors.Money} /> :
					<ActionTrendingDown color={Colors.Debt} />
			}
		/>
	);
}
