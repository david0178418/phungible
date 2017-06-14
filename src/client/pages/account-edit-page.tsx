
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import AccountEdit from '../components/account-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import Account from '../stores/account';
import AppStore from '../stores/app';
import AccountsPage from './accounts-page';
import Page from './page';

class AccountEditStore {
	public account: Account;
	public appStore: AppStore;

	constructor(appStore: AppStore, scheduledTransaction?: string) {
		this.appStore = appStore;

		if(scheduledTransaction) {
			this.account = appStore.findAccount(scheduledTransaction);
		} else {
			this.account = new Account();
		}
	}

	public saveAccount() {
		if(this.account.isValid) {
			this.appStore.saveAccount(this.account);
			this.account = new Account();
			return true;
		} else {
			return false;
		}
	}

	get accounts() {
		return this.appStore.accounts;
	}
}
type Props = {
	appStore?: AppStore;
	id: string;
	router?: Navigo;
};

@inject('appStore', 'router') @observer
export default
class AccountEditPage extends Component<Props, {}> {
	public static path = '/account/edit/';
	public static pathParams = '/account/edit/:id';
	private store: AccountEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new AccountEditStore(props.appStore, this.props.id);
	}

	public render() {
		const {
			account,
		} = this.store;
		const action = account.id ? 'Edit' : 'Create';

		return (
			<Page className="slide-horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => this.routeBack()}
					title={`${action} Account`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<AccountEdit
						model={account}
						onSubmit={() => this.handleSaveAccount()}
					/>
					<FloatingActionButton
						disabled={!account.isValid}
						onTouchTap={() => this.handleSaveAccount()}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ActionDone />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}

	private routeBack() {
		this.props.router.navigate(AccountsPage.path);
	}

	private handleSaveAccount() {
		setTimeout(() => {
			this.store.saveAccount();
			this.routeBack();
		}, 100);
	}
}
