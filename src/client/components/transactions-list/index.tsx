import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

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

class TransactionsStore {
	public appStore: AppStore;

	@observable private _openTransaction: Transaction;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
	}

	@action public closeOpenTransaction() {
		this._openTransaction = null;
	}
	@action public createTransaction() {
		this._openTransaction = new Transaction();
	}
	@action public saveTransaction() {
		this.appStore.saveTransaction(this._openTransaction);
		this.closeOpenTransaction();
	}
	@action public editTransaction(transaction: Transaction) {
		this._openTransaction = Transaction.clone(transaction);
	}
	@action public removeTransaction(transaction: Transaction) {
		this._openTransaction = Transaction.clone(transaction);
	}
	@computed get transactions() {
		return this.appStore.transactions;
	}
	@computed get isOpen() {
		return !!this._openTransaction;
	}
	get openTransaction(): Transaction {
		return this._openTransaction;
	}
}

@observer
export default
class TransactionsList extends Component<Props, {}> {
	private store: TransactionsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionsStore(props.store);
	}

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
						leftIcon={(
							// Hack for circular dep
							transaction.transactionType === 2 ?
								<IncomeIcon/> :
								<ExpenseIcon/>
						)}
						rightIconButton={EditRemoveMenu<Transaction>('transaction', transaction, onRemove)}
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
