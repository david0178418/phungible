
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
import {Link, withRouter} from 'react-router';

import Navigation from '../../layout/navigation';
import Colors from '../../shared/colors';
import AppStore from '../../shared/stores/app';
import ScheduledTransaction from '../../shared/stores/scheduled-transaction';
import {TransactionType} from '../../shared/stores/transaction';
import Styles from '../../shared/styles';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Handler = (scheduledTransaction: ScheduledTransaction) => void;
type Props = {
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
					secondaryText={`Current Balance: ${scheduledTransaction.amount.valFormatted}`}
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
class ScheduledTransactions extends Component<Props, any> {
	private store: ScheduledTransactionsStore;

	constructor(props: Props) {
		super(props);

		this.store = new ScheduledTransactionsStore(props.store);
	}

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const store = this.store;

		return (
			<div>
				<Navigation
					title="Budget"
					store={store.appStore}
				/>
				<ScheduledTransactionList
					scheduledTransactions={store.scheduledTransactions}
					onRemove={
						(scheduledTransaction: ScheduledTransaction) => this.props.store.removeScheduledTransaction(scheduledTransaction)
					}
				/>
				<FloatingActionButton
					containerElement={<Link to="/scheduled-transaction/edit" />}
					style={Styles.floatingActionButton}
					zDepth={2}
				>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}
}

export default withRouter(ScheduledTransactions);
