
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import {ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import {TransactionType} from '../../stores/transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	store: AppStore;
	scheduledTransactions: ScheduledTransaction[];
	onRemove: (scheduledTransaction: ScheduledTransaction) => void;
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

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public static path = '/scheduled-transactions/';
	private store: ScheduledTransactionsStore;

	constructor(props: Props) {
		super(props);
		this.store = new ScheduledTransactionsStore(props.store);
	}

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const {onRemove, scheduledTransactions} = this.props;

		return (
			<List>
				{scheduledTransactions.map((scheduledTransaction) => (
					<ListItem
						key={scheduledTransaction.id}
						primaryText={`${scheduledTransaction.name}`}
						secondaryText={`Amount: ${scheduledTransaction.amount.valFormatted}`}
						leftIcon={
							scheduledTransaction.type === TransactionType.Income ?
								<IncomeIcon/> :
								<ExpenseIcon/>
						}
						rightIconButton={EditRemoveMenu<ScheduledTransaction>('scheduled-transaction', scheduledTransaction, onRemove)}
					/>
				))}
				{!scheduledTransactions.length && (
					<ListItem
						primaryText="No recurring transactions available"
					/>
				)}
			</List>
		);
	}
}
