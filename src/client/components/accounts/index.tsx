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

import Navigation from '../../layout/navigation';
import Colors from '../../shared/colors';
import Account, {AccountType} from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import {floatingActionButtonStyle} from '../../shared/styles';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import EditRemoveMenu from '../shared/edit-remove-menu';
import Link from '../shared/link';

type Props = {
	disableAnimation: boolean;
};
type Context = {
	store: AppStore;
};
type ListProps = {
	accounts: Account[];
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

const AccountsList = observer(function({accounts, onRemove}: ListProps) {
	return (
		<List>
			{accounts.map((account) => (
				<ListItem
					key={account.id}
					primaryText={`${account.name}`}
					secondaryText={`Current Balance: $${account.latestBalanceUpdate && account.latestBalanceUpdate.balance.val}`}
					leftIcon={
						account.type === AccountType.Savings ?
							<EditorMoneyOn color={Colors.Money}/> :
							<ActionCreditCard color={Colors.Debt}/>
					}
					rightIconButton={EditRemoveMenu<Account>('account', account, onRemove)}
				/>
			))}
		</List>
	);
});

@observer
export default
class Accounts extends Component<Props, {}> {
	public static path = '/accounts/';
	public static contextTypes = {
		store: () => false,
	};
	public context: Context;
	private store: AcountsStore;

	constructor(props: Props) {
		super(props);
	}

	public componentWillMount() {
		this.store = new AcountsStore(this.context.store);
	}

	public removeAccount(account: Account) {
		this.context.store.removeAccount(account);
	}

	public render() {
		const store = this.store;

		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Accounts"
					store={store.appStore}
				/>
				<ContentArea>
					<AccountsList
						accounts={store.accounts}
						onRemove={(account: Account) => this.context.store.removeAccount(account)}
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
