import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import Account from '../../stores/account';
import AppStore from '../../stores/app';
import AccountEdit from '../account-edit';
import AccountsList from '../accounts-list';

class State {
	@observable public activeAccount: Account | null = null;
	@computed get accountIsOpen() {
		return !!this.activeAccount;
	}
	@action public editAccount(account?: Account) {
		this.activeAccount = account || new Account();
	}
	@action public closeAccount() {
		this.activeAccount = null;
	}
}

interface Props {
	accounts: Account[];
	appStore?: AppStore;
}

@inject('appStore') @observer
export default
class CreateAccountsStep extends React.Component<Props, State> {
	private store: State;

	constructor(props: Props) {
		super(props);
		this.store = new State();
	}

	public render() {
		const {
			accounts,
			appStore,
		} = this.props;
		return (
			<div>
				<AccountsList
					showCreate
					accounts={accounts}
					onRemove={(account: Account) => appStore.removeAccount(account)}
					onEdit={(account: Account) => this.handleOpenAccount(account)}
					onOpenCreate={() => this.handleOpenAccount()}
					store={appStore}
				/>
				<Dialog
					style={{
						paddingTop: 0,
					}}
					contentStyle={{
						maxWidth: 750,
						width: '100%',
					}}
					open={this.store.accountIsOpen}
					title="Create Account"
					actions={[
						<FlatButton
							label="Cancel"
							onTouchTap={() => this.handleCloseDialog()}
						/>,
						<RaisedButton
							primary
							disabled={this.store.accountIsOpen && !this.store.activeAccount.isValid}
							label="Save"
							onTouchTap={() => this.handleSaveAccount()}
						/>,
					]}
				>
					<AccountEdit
						account={this.store.activeAccount}
						onSubmit={() => this.handleSaveAccount()}
					/>
				</Dialog>
			</div>
		);
	}

	private handleOpenAccount(account?: Account) {
		this.store.editAccount(account);
	}

	private handleCloseDialog() {
		this.store.closeAccount();
	}

	private handleSaveAccount() {
		if(this.store.activeAccount.isValid) {
			this.props.appStore.saveAccount(this.store.activeAccount);
			this.store.closeAccount();
		}
	}
}
