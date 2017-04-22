import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import AppStore from '../../shared/stores/app';
import ScheduledTransaction, {ScheduledTransactionFacade} from '../../shared/stores/scheduled-transaction';
import {floatingActionButtonStyle} from '../../shared/styles';
import Page from '../pages/page';
import ScheduledTransactionEdit from '../scheduled-transaction-edit';
import ContentArea from '../shared/content-area';

class CreateScheduledTransactionStore {
	public scheduledTransaction: ScheduledTransaction | ScheduledTransactionFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransactionId?: number) {
		this.appStore = appStore;

		if(scheduledTransactionId) {
			this.scheduledTransaction = appStore.findScheduledTransaction(scheduledTransactionId);
		} else {
			this.scheduledTransaction = new ScheduledTransactionFacade();
		}
	}

	public saveScheduledTransactions() {
		if(this.scheduledTransaction.isValid) {
			if(this.scheduledTransaction instanceof ScheduledTransactionFacade) {
				this.scheduledTransaction.createScheduledTransactions().map((transaction) => {
					this.appStore.saveScheduledTransaction(transaction);
					this.scheduledTransaction = new ScheduledTransactionFacade();
				});
			} else {
				this.appStore.saveScheduledTransaction(this.scheduledTransaction);
				this.scheduledTransaction = new ScheduledTransactionFacade();
			}
			return true;
		} else {
			return false;
		}
	}

	get accounts() {
		return this.appStore.accounts;
	}
}

type Props = {
	id: number;
	store?: AppStore;
};

@observer
export default
class CreateScheduledTransaction extends Component<Props, {}> {
	public static path = '/scheduled-transaction/edit/';
	public static pathParams = '/scheduled-transaction/edit/:id';
	private store: CreateScheduledTransactionStore;

	constructor(props: Props) {
		super(props);
		this.store = new CreateScheduledTransactionStore(props.store, +props.id);
	}

	public render() {
		const {
			scheduledTransaction,
		} = this.store;
		const transactionsValid = this.store.scheduledTransaction.isValid;
		const action = (scheduledTransaction instanceof ScheduledTransaction && scheduledTransaction.id) ? 'Edit' : 'Create';

		return (
			<Page className="slide-horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => {
						// TODO FIX for React Router 4
						// (this.props as any).router.goBack();
						window.history.back();
					}}
					title={`${action} Budget Entry`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ScheduledTransactionEdit
						accounts={this.store.accounts}
						scheduledTransaction={this.store.scheduledTransaction}
						onSubmit={() => this.handleSaveScheduledTransaction()}
					/>
					<FloatingActionButton
						disabled={!transactionsValid}
						onTouchTap={() => this.handleSaveScheduledTransaction()}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ActionDone />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}

	private handleSaveScheduledTransaction() {
		setTimeout(() => {
			this.store.saveScheduledTransactions();
			// TODO FIX to use React Router 4
			// (this.props as any).router.push('/scheduled-transactions');
			window.location.hash = '/scheduled-transactions';
		}, 100);
	}
}