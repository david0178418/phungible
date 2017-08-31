import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';
import {inject} from 'mobx-react';
import * as React from 'react';

import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import TransactionsList from '../components/transactions-list';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class Transactions extends Component<Props, {}> {
	public static path = '/transactions';
	public static title = 'Transactions';

	public render() {
		const store = this.props.appStore;
		return (
			<Page animationDirection="vertical">
				<Navigation
					title="Transactions"
					appStore={store}
					iconElementRight={
						store.unconfirmedTransactions.length && (
							<IconMenu
								iconButtonElement={<IconButton><MoreVertical/></IconButton>}
							>
								<MenuItem
									onClick={() => store.openTransactionConfirmation()}
									primaryText="Confirm pending transactions"
								/>
							</IconMenu>
						)
					}
				/>
				<ContentArea>
					<TransactionsList
						items={store.transactions}
						onRemove={(transaction: Transaction) => this.props.appStore.removeTransaction(transaction)}
						store={store}
					/>
					<Button
						fab
						color="accent"
						component={Link}
						href="/transaction/edit"
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</Button>
				</ContentArea>
			</Page>
		);
	}
}
