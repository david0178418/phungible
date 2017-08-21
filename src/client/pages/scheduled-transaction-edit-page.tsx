import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import ScheduledTransactionEdit from '../components/scheduled-transaction-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction, {ScheduledTransactionFacade} from '../stores/scheduled-transaction';
import Page from './page';
import ScheduledTransactionsPage from './scheduled-transactions-page';

const {Component} = React;

class ScheduledTransactionEditStore {
	public scheduledTransaction: ScheduledTransaction | ScheduledTransactionFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, model: ScheduledTransactionFacade | ScheduledTransaction) {
		this.appStore = appStore;
		this.scheduledTransaction = model;
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
	id?: string;
	model?: ScheduledTransaction
	style?: any;
	router?: Navigo;
	onBack?: () => void;
	onSave?: () => void;
};

@inject('appStore', 'router') @observer
export default
class ScheduledTransactionEditPage extends Component<Props, {}> {
	public static path = '/scheduled-transaction/edit/';
	public static pathParams = '/scheduled-transaction/edit/:id';
	public static title = 'Recurring Transaction';
	private store: ScheduledTransactionEditStore;

	constructor(props: Props) {
		super(props);
		let model: ScheduledTransactionFacade | ScheduledTransaction;

		if(props.model) {
			model = props.model;
		} else if(props.id) {
			model = this.props.appStore.findScheduledTransaction(props.id);
		}
		if (!model) {
			model = new ScheduledTransactionFacade();
		}
		this.store = new ScheduledTransactionEditStore(props.appStore, model);
	}

	public render() {
		const {
			scheduledTransaction,
		} = this.store;
		const transactionsValid = this.store.scheduledTransaction.isValid;
		const action = (scheduledTransaction instanceof ScheduledTransaction && scheduledTransaction.id) ? 'Edit' : 'Create';
		const style = this.props.style || {};
		return (
			<Page animationDirection="horizontal" style={style}>
				<AppBar
					onLeftIconButtonTouchTap={() => this.routeBack()}
					title={`${action} ${ScheduledTransactionEditPage.title}`}
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
						onClick={() => this.handleSaveScheduledTransaction()}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ActionDone />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}

	private routeBack() {
		this.props.onBack ?
			this.props.onBack() :
			this.props.router.navigate(ScheduledTransactionsPage.path);
	}

	private handleSaveScheduledTransaction() {
		if(this.props.onSave) {
			this.props.onSave();
		} else {
			this.store.saveScheduledTransactions();
		}
		this.routeBack();
	}
}
