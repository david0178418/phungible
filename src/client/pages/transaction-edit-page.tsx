import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import ContentArea from '../components/shared/content-area';
import TransactionEdit from '../components/transaction-edit';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';
import TransactionsPage from './transactions-page';

const {Component} = React;

class TransactionEditStore {
	public transaction: Transaction;
	private appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransaction?: string) {
		this.appStore = appStore;

		if(scheduledTransaction) {
			this.transaction = appStore.findTransaction(scheduledTransaction);
		} else {
			this.transaction = new Transaction();
		}
	}

	public saveTransaction() {
		if(this.transaction.isValid) {
			this.appStore.saveTransaction(this.transaction);
			this.transaction = new Transaction();
			return true;
		} else {
			return false;
		}
	}
}

interface Props {
	appStore?: AppStore;
	id: string;
	router?: Navigo;
}

@inject('appStore', 'router') @observer
export default
class TransactionEditPage extends Component<Props, {}> {
	public static path = '/transaction/edit/';
	public static pathParams = '/transaction/edit/:id';
	public static title = 'Tranasaction Edit';
	private store: TransactionEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionEditStore(props.appStore, props.id);
	}

	public render() {
		const {
			accounts,
			budgets,
		} = this.props.appStore;
		const {
			transaction,
		} = this.store;
		const action = transaction.id ? 'Edit' : 'Create';

		return (
			<Page animationDirection="horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => this.routeBack()}
					title={`${action} Transaction`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<TransactionEdit
						accounts={accounts}
						budgets={budgets}
						transaction={transaction}
						onSubmit={() => this.handleSaveTransaction()}
					/>
					<FloatingActionButton
						disabled={!transaction.isValid}
						onClick={() => this.handleSaveTransaction()}
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
		this.props.router.navigate(TransactionsPage.path);
	}

	private handleSaveTransaction() {
		setTimeout(() => {
			this.store.saveTransaction();
			this.routeBack();
		}, 100);
	}
}
