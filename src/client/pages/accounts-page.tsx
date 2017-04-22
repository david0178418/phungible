import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import AccountsList from '../components/accounts-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import Account from '../shared/stores/account';
import AppStore from '../shared/stores/app';
import {floatingActionButtonStyle} from '../shared/styles';
import Page from './page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

@observer
export default
class Accounts extends Component<Props, {}> {
	public static path = '/accounts/';

	public render() {
		const store = this.props.store;

		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Accounts"
					store={store}
				/>
				<ContentArea>
					<AccountsList
						accounts={store.accounts}
						onRemove={(account: Account) => store.removeAccount(account)}
						store={store}
					/>
					<FloatingActionButton
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
