
import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionTrendingDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ActionTrendingUp from 'material-ui/svg-icons/navigation/arrow-upward';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import Colors from '../../shared/colors';
import AppStore from '../../shared/stores/app';
import ScheduledTransaction from '../../shared/stores/scheduled-transaction';
import {TransactionType} from '../../shared/stores/transaction';
import {floatingActionButtonStyle} from '../../shared/styles';
import ContentArea from '../shared/content-area';
import EditRemoveMenu from '../shared/edit-remove-menu';
import Link from '../shared/link';

type Handler = (scheduledTransaction: ScheduledTransaction) => void;
type Props = {};
type Context = {
	store: AppStore;
};
type ListProps = {
	scheduledTransactions: ScheduledTransaction[];
	onRemove: Handler;
};

class ScheduledTransactionsStore {
	public appStore: AppStore;
	@observable private _openScheduledTransaction: ScheduledTransaction | null;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
		(window as any).schduledTransactionsStore = this;
	}

	@action public closeOpenScheduledTransaction() {
		this._openScheduledTransaction = null;
	}
	@action public createScheduledTransaction() {
		this._openScheduledTransaction = new ScheduledTransaction();
	}
	@action public saveScheduledTransaction() {
		this.appStore.saveScheduledTransaction(this._openScheduledTransaction);
		this.closeOpenScheduledTransaction();
	}
	@action public editScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this._openScheduledTransaction = ScheduledTransaction.clone(scheduledTransaction);
	}

	@computed get accounts() {
		return this.appStore.accounts;
	}
	@computed get scheduledTransactions() {
		return this.appStore.scheduledTransactions;
	}
	@computed get isOpen() {
		return !!this._openScheduledTransaction;
	}
	get openScheduledTransaction(): ScheduledTransaction {
		return this._openScheduledTransaction;
	}
}

const ScheduledTransactionList = observer(function({scheduledTransactions, onRemove}: ListProps) {
	return (
		<List>
			{scheduledTransactions.map((scheduledTransaction) => (
				<ListItem
					key={scheduledTransaction.id}
					primaryText={`${scheduledTransaction.name}`}
					secondaryText={`Amount: ${scheduledTransaction.amount.valFormatted}`}
					leftIcon={
						scheduledTransaction.type === TransactionType.Income ?
							<ActionTrendingUp color={Colors.Money} /> :
							<ActionTrendingDown color={Colors.Debt} />
					}
					rightIconButton={EditRemoveMenu<ScheduledTransaction>('scheduled-transaction', scheduledTransaction, onRemove)}
				/>
			))}
		</List>
	);
});

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public static path = '/scheduled-transactions/';
	public static contextTypes = {
		store: () => false,
	};
	public context: Context;
	private store: ScheduledTransactionsStore;

	public componentWillMount() {
		this.store = new ScheduledTransactionsStore(this.context.store);
	}

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.context.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const store = this.store;

		return (
			<div>
				<Navigation
					title="Budget"
					store={store.appStore}
				/>
				<ContentArea>
					<ScheduledTransactionList
						scheduledTransactions={store.scheduledTransactions}
						onRemove={
							(scheduledTransaction: ScheduledTransaction) =>
								this.context.store.removeScheduledTransaction(scheduledTransaction)
						}
					/>
					<FloatingActionButton
						containerElement={<Link to="/scheduled-transaction/edit" />}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</div>
		);
	}
}
