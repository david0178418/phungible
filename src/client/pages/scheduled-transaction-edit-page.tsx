import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransactionEdit from '../components/scheduled-transaction-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction, {ScheduledTransactionFacade} from '../stores/scheduled-transaction';
import Page from './page';
import ScheduledTransactionsPage from './scheduled-transactions-page';

class CreateScheduledTransactionStore {
	public scheduledTransaction: ScheduledTransaction | ScheduledTransactionFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransactionId?: string) {
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
	appStore?: AppStore;
	id: string;
	router?: Navigo;
};

@inject('appStore', 'router') @observer
export default
class CreateScheduledTransaction extends Component<Props, {}> {
	public static path = '/scheduled-transaction/edit/';
	public static pathParams = '/scheduled-transaction/edit/:id';
	public static title = 'Recurring Transaction';
	private store: CreateScheduledTransactionStore;

	constructor(props: Props) {
		super(props);
		this.store = new CreateScheduledTransactionStore(props.appStore, props.id);
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
					onLeftIconButtonTouchTap={() => this.routeBack()}
					title={`${action} ${CreateScheduledTransaction.title}`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ScheduledTransactionEdit
						accounts={this.store.accounts}
						model={this.store.scheduledTransaction}
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
			this.routeBack();
		}, 100);
	}

	private routeBack() {
		this.props.router.navigate(ScheduledTransactionsPage.path);
	}
}
