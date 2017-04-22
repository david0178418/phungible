
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import ScheduledTransaction from '../../shared/stores/scheduled-transaction';
import {floatingActionButtonStyle} from '../../shared/styles';
import Page from '../pages/page';
import ScheduledTransactionList from '../schduled-transactions-list';
import ContentArea from '../shared/content-area';
import Link from '../shared/link';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

@observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public static path = '/scheduled-transactions/';

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.store.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const store = this.props.store;

		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Budget"
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