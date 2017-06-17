import FloatingActionButton from 'material-ui/FloatingActionButton';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {inject} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import TransactionsList from '../components/transactions-list';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

type Props = {
	appStore?: AppStore;
	disableAnimation: boolean;
};

@inject('appStore')
export default
class Transactions extends Component<Props, {}> {
	public static path = '/transactions';

	public render() {
		const store = this.props.appStore;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Transactions"
					appStore={store}
					iconElementRight={
						store.unconfirmedTransactions.length && (
							<IconMenu
								anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
								iconButtonElement={<IconButton><MoreVertical/></IconButton>}
								targetOrigin={{horizontal: 'right', vertical: 'top'}}
							>
								<MenuItem
									onTouchTap={() => store.openTransactionConfirmation()}
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
					<FloatingActionButton
						secondary
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
