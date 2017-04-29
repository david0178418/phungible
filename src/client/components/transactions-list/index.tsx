import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import * as React from 'react';
import {Component} from 'react';

import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	store: AppStore;
	transactions: Transaction[];
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

export default
class TransactionsList extends Component<Props, {}> {
	private store: TransactionsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionsStore(props.store);
	}

	public render() {
		const {onRemove, transactions} = this.props;
		return (
			<List>
				{transactions.map((transaction) => (
					<ListItem
						key={transaction.id}
						primaryText={`${transaction.amount.valFormatted}`}
						secondaryText={`${transaction.name}`}
						rightIconButton={EditRemoveMenu<Transaction>('transaction', transaction, onRemove)}
					/>
				))}
			</List>
		);
	}
}
