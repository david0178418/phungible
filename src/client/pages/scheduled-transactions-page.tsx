import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import ScheduledTransactionList from '../components/scheduled-transactions-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Page from './page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public static path = '/scheduled-transactions/';
	public static title= 'Recurring Transactions';

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const store = this.props.store;

		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title={ScheduledTransactions.title}
					store={store}
				/>
				<ContentArea>
					<ScheduledTransactionList
						scheduledTransactions={store.scheduledTransactions}
						store={store}
						onRemove={
							(scheduledTransaction: ScheduledTransaction) =>
								this.props.store.removeScheduledTransaction(scheduledTransaction)
						}
					/>
					<FloatingActionButton
						secondary
						containerElement={<Link to="/scheduled-transaction/edit" />}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}
}
