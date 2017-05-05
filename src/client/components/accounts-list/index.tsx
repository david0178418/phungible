import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card';
import EditorMoneyOn from 'material-ui/svg-icons/editor/attach-money';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import Colors from '../../shared/colors';
import Account, {AccountType} from '../../stores/account';
import AppStore from '../../stores/app';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	accounts: Account[];
	onRemove: (account: Account) => void;
	store: AppStore;
};

class AcountsStore {
	public appStore: AppStore;
	@observable public open: boolean = false;
	@observable private _openAccount: Account | null;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
		(window as any).accountsStore = this;
	}

	@action public closeOpenAccount() {
		this._openAccount = null;
	}
	@action public createAccount() {
		this._openAccount = new Account();
	}
	@action public saveAccount() {
		if(!this._openAccount) {
			return;
		}

		this.appStore.saveAccount(this._openAccount);
		this.closeOpenAccount();
	}
	@action public editAccount(account: Account) {
		this._openAccount = Account.clone(account);
	}
	@action public removeAccount(account: Account) {
		this._openAccount = Account.clone(account);
	}
	@action public confirmRemoval() {
		this.open = true;
	}
	@action public closeModal() {
		this.open = false;
	}
	@computed get accounts() {
		return this.appStore.accounts;
	}
	@computed get isOpen() {
		return !!this._openAccount;
	}
	get openAccount() {
		return this._openAccount;
	}
}

@observer
export default
class AccountsList extends Component<Props, {}> {
	public static path = '/accounts/';
	private store: AcountsStore;

	constructor(props: Props) {
		super(props);
		this.store = new AcountsStore(props.store);
	}

	public removeAccount(account: Account) {
		this.props.store.removeAccount(account);
	}

	public render() {
		const {accounts, onRemove} = this.props;

		return (
			<div>
				<List>
					{accounts.map((account) => (
						<span key={account.id}>
							<ListItem
								primaryText={`${account.name}`}
								secondaryText={`Current Balance: $${account.latestBalanceUpdate && account.latestBalanceUpdate.balance.val}`}
								leftIcon={
									account.type === AccountType.Savings ?
										<EditorMoneyOn color={Colors.Money}/> :
										<ActionCreditCard color={Colors.Debt}/>
								}
								rightIconButton={EditRemoveMenu<Account>('account', account, () => this.store.confirmRemoval())}
							/>
							<Dialog
								modal
								open={this.store.open}
								title={`Deleting '${account.name}' will delete related entries. Delete?`}
								actions={[
									<FlatButton
										primary
										label="Cancel"
										onTouchTap={() => this.store.closeModal()}
									/>,
									<FlatButton
										primary
										label="Delete"
										onTouchTap={() => {
											this.store.closeModal();
											onRemove(account);
										}}
									/>,
								]}
							/>
						</span>
					))}
				</List>
			</div>
		);
	}
}
