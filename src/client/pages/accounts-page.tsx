import Button from 'material-ui/Button';
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
					<AccountsList
						items={store.accounts}
						onRemove={(account: Account) => store.removeAccount(account)}
						store={store}
					/>
					<Button
						fab
						component={Link}
						href="/account/edit"
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</Button>
				</ContentArea>
			</Page>
		);
	}
}
