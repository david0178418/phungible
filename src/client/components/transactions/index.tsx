import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Transaction from '../../shared/stores/transaction';
import {floatingActionButtonStyle} from '../../shared/styles';
import ContentArea from '../shared/content-area';
import EditRemoveMenu from '../shared/edit-remove-menu';
import Link from '../shared/link';

type Props = {};
type Context = {
	store: AppStore;
};
type ListProps = {
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

const TransactionsList = observer(function({transactions, onRemove}: ListProps) {
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
});

export default
class Transactions extends Component<Props, {}> {
	public static path = '/transactions';
	public static contextTypes = {
		store: () => false,
	};
	public context: Context;
	private store: TransactionsStore;

	public componentWillMount() {
		this.store = new TransactionsStore(this.context.store);
	}

	public render() {
		const store = this.store;
		return (
			<div>
				<Navigation
					title="Transactions"
					store={store.appStore}
				/>
				<ContentArea>
					<TransactionsList
						transactions={store.transactions}
						onRemove={(transaction: Transaction) => this.context.store.removeTransaction(transaction)}
					/>
					<FloatingActionButton
						containerElement={<Link to="/transaction/edit" />}
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</div>
		);
	}
}
