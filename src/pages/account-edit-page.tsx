import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import AccountEdit from '../components/account-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import Account from '../stores/account';
import AppStore from '../stores/app';
import AccountsPage from './accounts-page';
import Page from './page';

const { Component } = React;

class AccountEditStore {
	public account: Account;
	public appStore: AppStore;

	constructor(appStore: AppStore, model: Account) {
		this.appStore = appStore;
		this.account = model;
	}

	public saveAccount() {
		if(this.account.isValid) {
			this.appStore.currentProfile.saveAccount(this.account);
			this.account = new Account();
			return true;
		} else {
			return false;
		}
	}

	get accounts() {
		return this.appStore.currentProfile.accounts;
	}
}
type Props = {
	appStore?: AppStore;
	id?: string;
	model?: Account;
	style?: any;
	router?: Navigo;
	onBack?: () => void;
	onSave?: () => void;
};

@inject('appStore', 'router') @observer
export default
class AccountEditPage extends Component<Props> {
	public static path = '/account/edit/';
	public static pathParams = '/account/edit/:id';
	public static title = 'Account Edit';
	private store: AccountEditStore;

	constructor(props: Props) {
		super(props);
		let model: Account;

		if(props.model) {
			model = props.model;
		} else if(props.id) {
			model = this.props.appStore.currentProfile.findAccount(this.props.id);
		}

		if(!model) {
			model = new Account();
		}
		this.store = new AccountEditStore(props.appStore, model);
	}

	public render() {
		const {
			account,
		} = this.store;
		const action = account.id ? 'Edit' : 'Create';
		const style = this.props.style || {};
		return (
			<Page animationDirection="horizontal" style={style} >
				<AppBar
					onLeftIconButtonClick={() => this.routeBack()}
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
						onClick={() => this.handleSaveAccount()}
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
		this.props.onBack ?
			this.props.onBack() :
			this.props.router.navigate(AccountsPage.path);
	}

	private handleSaveAccount() {
		if(this.props.onSave) {
			this.props.onSave();
		} else {
			this.store.saveAccount();
			this.routeBack();
		}
	}
}
