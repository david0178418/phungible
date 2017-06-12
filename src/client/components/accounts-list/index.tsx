import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import {AddIcon, DebtIcon, SavingsIcon} from '../../shared/shared-components';
import Account, {AccountType} from '../../stores/account';
import AppStore from '../../stores/app';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	accounts: Account[];
	showCreate?: boolean;
	store: AppStore;
	onEdit?: (account: Account) => void;
	onOpenCreate?: () => void;
	onRemove: (account: Account) => void;
};

class AcountsStore {
	public appStore: AppStore;
	@observable public deletionCandidate: Account | null = null;
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
	@action public confirmRemoval(account: Account) {
		this.deletionCandidate = account;
	}
	@action public closeConfirmRemoval() {
		this.deletionCandidate = null;
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

	public render() {
		const {
			accounts,
			onRemove,
			onOpenCreate,
			showCreate,
			store,
		} = this.props;
		const {deletionCandidate} = this.store;
		const today = new Date();

		return (
			<div>
				<List>
					{showCreate && (
						<ListItem
							rightIcon={
								<AddIcon/>
							}
							onTouchTap={onOpenCreate}
							primaryText="Create Account"
						/>
					) || (
						<ListItem
							primaryText="No accounts available"
						/>
					)}
					{accounts.map((account) => (
						<ListItem
							key={account.id}
							primaryText={`${account.name}`}
							secondaryText={`Current Balance: ${store.getBalanceAsOfDate(account, today).valFormatted}`}
							leftIcon={
								account.type === AccountType.Savings ?
									<SavingsIcon/> :
									<DebtIcon/>
							}
							rightIconButton={EditRemoveMenu<Account>(
								'account',
								account,
								() => this.store.confirmRemoval(account),
								() => this.props.onEdit(account),
							)}
						/>
					))}
				</List>
				<Dialog
					modal
					open={!!deletionCandidate}
					title={deletionCandidate && `Deleting '${deletionCandidate.name}' will delete related entries. Delete?`}
					actions={[
						<FlatButton
							primary
							label="Cancel"
							onTouchTap={() => this.store.closeConfirmRemoval()}
						/>,
						<FlatButton
							primary
							label="Delete"
							onTouchTap={() => {
								this.store.closeConfirmRemoval();
								onRemove(deletionCandidate);
							}}
						/>,
					]}
				/>
			</div>
		);
	}
}
