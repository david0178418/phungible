import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import AccountsList from '../components/accounts-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import Account from '../stores/account';
import AppStore from '../stores/app';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
@observer
export default
class Accounts extends Component<Props, {}> {
	public static path = '/accounts/';
	public static title = 'Accounts';

	public render() {
		const store = this.props.appStore;

		return (
			<Page animationDirection="vertical">
				<Navigation
					title="Accounts"
					appStore={store}
					iconElementRight={
						store.currentProfile.unconfirmedTransactions.length && (
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
					<AccountsList
						items={store.currentProfile.accounts}
						onRemove={(account: Account) => store.currentProfile.removeAccount(account)}
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
