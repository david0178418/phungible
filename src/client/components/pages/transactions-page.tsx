import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Transaction from '../../shared/stores/transaction';
import {floatingActionButtonStyle} from '../../shared/styles';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import Link from '../shared/link';
import TransactionsList from '../transactions-list';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class Transactions extends Component<Props, {}> {
	public static path = '/transactions';

	public render() {
		const store = this.props.store;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Transactions"
					store={store}
				/>
				<ContentArea>
					<TransactionsList
						transactions={store.transactions}
						onRemove={(transaction: Transaction) => this.props.store.removeTransaction(transaction)}
						store={store}
					/>
					<FloatingActionButton
						containerElement={<Link to="/transaction/edit" />}
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}
}
