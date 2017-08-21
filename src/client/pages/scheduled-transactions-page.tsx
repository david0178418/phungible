import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import ScheduledTransactionList from '../components/scheduled-transactions-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore') @observer
export default
class ScheduledTransactions extends Component<Props, {}> {
	public static path = '/scheduled-transactions/';
	public static title= 'Recurring Transactions';

	public removeScheduledTransaction(scheduledTransaction: ScheduledTransaction) {
		this.props.appStore.removeScheduledTransaction(scheduledTransaction);
	}

	public render() {
		const store = this.props.appStore;

		return (
			<Page animationDirection="vertical">
				<Navigation
					title={ScheduledTransactions.title}
					appStore={store}
				/>
				<ContentArea>
					<ScheduledTransactionList
						items={store.scheduledTransactions}
						store={store}
						onRemove={
							(scheduledTransaction: ScheduledTransaction) =>
								this.props.appStore.removeScheduledTransaction(scheduledTransaction)
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
