import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {browserHistory, Link} from 'react-router';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Transaction from '../../shared/stores/transaction';
import Styles from '../../shared/styles';

type Props = {
	store: AppStore;
};
type ListProps = {
	transactions: Transaction[];
	onEdit: (transactionId: number) => void;
	onRemove: (transaction: Transaction) => void;
};

class TransactionsStore {
	@observable private _openTransaction: Transaction;

	private appStore: AppStore;

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

const TransactionsList = observer(function({transactions, onEdit, onRemove}: ListProps) {
	return (
		<List>
			{transactions.map((transaction) => {
				const iconButton = (
					<IconButton
						onTouchTap={() => onRemove(transaction)}
					><ContentRemove/></IconButton>
				);
				return (
					<ListItem
						key={transaction.id}
						primaryText={`${transaction.amount.valFormatted}`}
						secondaryText={`${transaction.name}`}
						onTouchTap={() => onEdit(transaction.id)}
						rightIconButton={iconButton}
					/>
				);
			})}
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
				/>
				<TransactionsList
					transactions={store.transactions}
					onRemove={(transaction: Transaction) => this.props.store.removeTransaction(transaction)}
					onEdit={(transactionId: number) => this.handleEditTransaction(transactionId)}
				/>
				<FloatingActionButton
					containerElement={<Link to="/transaction-edit" />}
					style={Styles.floatingActionButton}
					zDepth={2}
				>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}

	private handleEditTransaction(transactionId: number) {
		browserHistory.push(`/transaction-edit/${transactionId}`);
	}
}
