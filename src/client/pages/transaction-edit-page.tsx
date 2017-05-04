import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ContentArea from '../components/shared/content-area';
import TransactionEdit from '../components/transaction-edit';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

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

	get accounts() {
		return this.appStore.accounts;
	}

	get transactions() {
		return this.appStore.transactions;
	}
}
type Props = {
	id: string;
	store?: AppStore;
};

@observer
export default
class TransactionEditPage extends Component<Props, {}> {
	public static path = '/transaction/edit/';
	public static pathParams = '/transaction/edit/:id';
	private store: TransactionEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionEditStore(props.store, props.id);
	}

	public render() {
		const {
			accounts,
			transaction,
		} = this.store;
		const action = transaction.id ? 'Edit' : 'Create';

		return (
			<Page className="slide-horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => window.history.back()}
					title={`${action} Transaction`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<TransactionEdit
						accounts={accounts}
						transaction={transaction}
						onSubmit={() => this.handleSaveTransaction()}
					/>
					<FloatingActionButton
						disabled={!transaction.isValid}
						onTouchTap={() => this.handleSaveTransaction()}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ActionDone />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}

	private handleSaveTransaction() {
		setTimeout(() => {
			this.store.saveTransaction();
			window.history.back();
		}, 100);
	}
}
