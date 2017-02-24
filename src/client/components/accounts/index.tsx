import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ActionCreditCard from 'material-ui/svg-icons/action/credit-card';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditorMoneyOn from 'material-ui/svg-icons/editor/attach-money';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {browserHistory, Link} from 'react-router';

import Navigation from '../../layout/navigation';
import Account, {AccountType} from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import Styles from '../../shared/styles';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	store: AppStore;
};
type ListProps = {
	accounts: Account[];
	onEdit: (account: Account) => void;
	onRemove: (account: Account) => void;
};

class AcountsStore {
	public appStore: AppStore;
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

const AccountsList = observer(function({accounts, onEdit, onRemove}: ListProps) {
	return (
		<List>
			{accounts.map((account) => (
				<ListItem
					key={account.id}
					primaryText={`${account.name}`}
					secondaryText={`Current Balance: $${account.latestBalanceUpdate && account.latestBalanceUpdate.balance.val}`}
					leftIcon={account.type === AccountType.Savings ? <EditorMoneyOn/> : <ActionCreditCard/>}
					onTouchTap={() => onEdit(account)}
					rightIconButton={EditRemoveMenu<Account>(account, onEdit, onRemove)}
				/>
			))}
		</List>
	);
});

@observer
export default
class Accounts extends Component<any, any> {
	private store: AcountsStore;

	constructor(props: Props) {
		super(props);

		this.store = new AcountsStore(props.store);
	}

	public removeAccount(account: Account) {
		this.props.store.removeAccount(account);
	}

	public render() {
		const store = this.store;

		return (
			<div>
				<Navigation
					title="Accounts"
				/>
				<AccountsList
					accounts={store.accounts}
					onRemove={(account: Account) => this.props.store.removeAccount(account)}
					onEdit={(account: Account) => this.handleEditAccount(account)}
				/>
				<FloatingActionButton
					containerElement={<Link to="/account-edit" />}
					style={Styles.floatingActionButton}
					zDepth={2}
				>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}

	private handleEditAccount(account: Account) {
		browserHistory.push(`/account-edit/${account.id}`);
	}
}
