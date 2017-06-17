import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import AccountsList from '../components/accounts-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import Account from '../stores/account';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	appStore?: AppStore;
	disableAnimation: boolean;
};

@inject('appStore')
@observer
export default
class Accounts extends Component<Props, {}> {
	public static path = '/accounts/';

	public render() {
		const store = this.props.appStore;

		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Accounts"
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
					<AccountsList
						items={store.accounts}
						onRemove={(account: Account) => store.removeAccount(account)}
						store={store}
					/>
					<FloatingActionButton
						secondary
						containerElement={<Link to="/account/edit" />}
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
