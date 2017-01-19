import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {browserHistory} from 'react-router';

import AppStore from '../../shared/stores/app';
import Transaction from '../../shared/stores/transaction';
import Styles from '../../shared/styles';
import TransactionForm from '../transaction-form';

class TransactionEditStore {
	public transaction: Transaction;
	public appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransaction?: number) {
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

	get transactions() {
		return this.appStore.transactions;
	}
}
type Props = {
	store: AppStore;
	params: {
		id: number;
	};
};

@observer
export default
class TransactionEdit extends Component<Props, any> {
	private store: TransactionEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new TransactionEditStore(props.store, +props.params.id);
	}

	public render() {
		const {
			transaction,
		} = this.store;
		const action = transaction.id ? 'Edit' : 'Create';

		return (
			<div>
				<AppBar
					className="app-title"
					onLeftIconButtonTouchTap={() => browserHistory.goBack()}
					title={`${action} Transaction`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<TransactionForm
					transaction={transaction}
					onSubmit={() => this.handleSaveTransaction()}
				/>
				<FloatingActionButton
					disabled={!transaction.isValid}
					onTouchTap={() => this.handleSaveTransaction()}
					style={Styles.floatingActionButton}
					zDepth={2}
				>
					<ActionDone />
				</FloatingActionButton>
			</div>
		);
	}

	private handleSaveTransaction() {
		setTimeout(() => {
			this.store.saveTransaction();
			browserHistory.push('/transactions');
		}, 100);
	}
}
