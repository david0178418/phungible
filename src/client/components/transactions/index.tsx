import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Transaction from '../../shared/stores/transaction';
import Styles from '../../shared/styles';
import ContentArea from '../shared/content-area';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
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
class Transactions extends Component<Props, any> {
	private store: TransactionsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionsStore(props.store);
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
						onRemove={(transaction: Transaction) => this.props.store.removeTransaction(transaction)}
					/>
					<FloatingActionButton
						containerElement={<Link to="/transaction/edit" />}
						style={Styles.floatingActionButton}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</div>
		);
	}
}
