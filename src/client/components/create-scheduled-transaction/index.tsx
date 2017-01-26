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
import ScheduledTransaction from '../../shared/stores/scheduled-transaction';
import Styles from '../../shared/styles';
import ScheduledTransactionEdit from '../scheduled-transaction-edit';

class CreateScheduledTransactionStore {
	public scheduledTransaction: ScheduledTransaction;
	private appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransactionId?: number) {
		this.appStore = appStore;

		if(scheduledTransactionId) {
			this.scheduledTransaction = appStore.findScheduledTransaction(scheduledTransactionId);
		} else {
			this.scheduledTransaction = new ScheduledTransaction();
		}
	}

	public saveScheduledTransaction() {
		if(this.scheduledTransaction.isValid) {
			this.appStore.saveScheduledTransaction(this.scheduledTransaction);
			this.scheduledTransaction = new ScheduledTransaction();
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
	store: AppStore;
	params: {
		id: number;
	};
};

@observer
export default
class CreateScheduledTransaction extends Component<Props, any> {
	private store: CreateScheduledTransactionStore;

	constructor(props: Props) {
		super(props);
		this.store = new CreateScheduledTransactionStore(props.store, +props.params.id);
	}

	public render() {
		const {
			scheduledTransaction,
		} = this.store;
		const action = scheduledTransaction.id ? 'Edit' : 'Create';

		return (
			<div>
				<AppBar
					className="app-title"
					onLeftIconButtonTouchTap={() => browserHistory.goBack()}
					title={`${action} Budget Entry`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ScheduledTransactionEdit
					accounts={this.store.accounts}
					scheduledTransaction={this.store.scheduledTransaction}
					onSubmit={() => this.handleSaveScheduledTransaction()}
				/>
				<FloatingActionButton
					disabled={!scheduledTransaction.isValid}
					onTouchTap={() => this.handleSaveScheduledTransaction()}
					style={Styles.floatingActionButton}
					zDepth={2}
				>
					<ActionDone />
				</FloatingActionButton>
			</div>
		);
	}

	private handleSaveScheduledTransaction() {
		setTimeout(() => {
			this.store.saveScheduledTransaction();
			browserHistory.push('/schduled-transactions');
		}, 100);
	}
}
