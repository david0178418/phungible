import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {browserHistory} from 'react-router';

import Account from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import AccountForm from '../account-form';

class AccountEditStore {
	public account: Account;
	public appStore: AppStore;

	constructor(appStore: AppStore, budgetEntryId?: number) {
		this.appStore = appStore;

		if(budgetEntryId) {
			this.account = appStore.findAccount(budgetEntryId);
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
	store: AppStore;
	params: {
		id: number;
	};
};

@observer
export default
class AccountEdit extends Component<Props, any> {
	private store: AccountEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new AccountEditStore(props.store, +props.params.id);
	}

	public render() {
		const {
			account,
		} = this.store;
		const action = account.id ? 'Edit' : 'Create';

		return (
			<div>
				<AppBar
					className="app-title"
					onLeftIconButtonTouchTap={() => browserHistory.goBack()}
					title={`${action} Account`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<AccountForm
					account={account}
					onSubmit={() => this.handleSaveAccount()}
				/>
				<FloatingActionButton
					disabled={!account.isValid}
					onTouchTap={() => this.handleSaveAccount()}
					zDepth={2}
				>
					<ActionDone />
				</FloatingActionButton>
			</div>
		);
	}

	private handleSaveAccount() {
		this.store.saveAccount();
		browserHistory.push('/accounts');
	}
}
