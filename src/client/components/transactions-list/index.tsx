import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {observer} from 'mobx-react';
import * as React from 'react';

import {TransactionType} from '../../constants';
import {ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

const {Component} = React;

type Props = {
	store: AppStore;
	items: Transaction[];
	onRemove: (transaction: Transaction) => void;
};

@observer
export default
class TransactionsList extends Component<Props, {}> {

	public render() {
		const {onRemove, items} = this.props;
		return (
			<List>
				{items.map((transaction) => (
					<ListItem
						key={transaction.id}
						primaryText={
							`${transaction.amount.valFormatted} ${transaction.name} ` +
							(transaction.needsConfirmation ? '(pending)' : '')
						}
						secondaryText={(
							(transaction.fromAccount ?
								`From: ${transaction.fromAccount.name}` : '') +
							(transaction.towardAccount && transaction.fromAccount ? ', ' : '') +
							(transaction.towardAccount ?
								`Toward: ${transaction.towardAccount.name}` : '')
						)}
						href={`#/${Transaction.type}/edit/${transaction.id}`}
						leftIcon={(
							// Hack for circular dep
							transaction.transactionType === TransactionType.Income ?
								<IncomeIcon/> :
								<ExpenseIcon/>
						)}
						rightIconButton={EditRemoveMenu<Transaction>(Transaction.type, transaction, onRemove)}
					/>
				))}
				{!items.length && (
					<ListItem
						primaryText="No transactions available"
					/>
				)}
			</List>
		);
	}
}
