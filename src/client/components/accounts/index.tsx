import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import Icon from '../../shared/icon';
import Account, {AccountType} from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import AccountEdit from '../account-edit';

type AccountHandler = (account: Account) => void;
type Props = {
	store: AppStore;
};
type TableProps = {
	accounts: Account[];
	onEdit: AccountHandler;
	onRemove: AccountHandler;
};
type EditModalProps = {
	account: Account;
	isOpen: boolean;
	save(): void;
	cancel(): void
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
	get openAccount(): Account {
		return this._openAccount;
	}
}

function Row(onRemove: AccountHandler, onEdit: AccountHandler, account: Account) {
	return (
		<tr key={`${account.name}+${account.type}+${account.todaysBalance}`}>
			<td>{account.name}</td>
			<td>{AccountType[account.type]}</td>
			<td>${account.prettyAmount}</td>
			<td>
				<Button color="link" onClick={() => onEdit(account)}>
					<Icon type="pencil"/>
				</Button>
				<Button color="link" onClick={() => onRemove(account)}>
					<Icon type="close"/>
				</Button>
			</td>
		</tr>
	);
}

const Table = observer(function({accounts, onEdit, onRemove}: TableProps) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Balance</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{accounts.map(Row.bind(null, onRemove, onEdit))}
			</tbody>
		</table>
	);
});

const EditModal = observer(function({account, cancel, isOpen, save}: EditModalProps) {
	return (
		<Modal isOpen={isOpen} toggle={cancel} className="modal-lg">
			<ModalHeader toggle={cancel}>Create Account</ModalHeader>
			<ModalBody>
				<AccountEdit
					account={account}
					onSubmit={() => {/*TODO*/}}
				/>
			</ModalBody>
			<ModalFooter>
				<Button
					color="primary"
					onClick={save}
					disabled={!account.isValid}
				>
					Save
				</Button>{' '}
				<Button color="secondary" onClick={cancel}>Cancel</Button>
			</ModalFooter>
		</Modal>
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
				<Button color="primary" onClick={() => this.handleCreateAccount()}>
					<Icon type="plus" />
					{' Create Account'}
				</Button>
				<Table
					accounts={store.accounts}
					onRemove={(account: Account) => this.props.store.removeAccount(account)}
					onEdit={(account: Account) => this.store.editAccount(account)}
				/>
				{store.isOpen &&
					<EditModal
						account={store.openAccount}
						cancel={() => store.closeOpenAccount()}
						isOpen={store.isOpen}
						save={() => store.saveAccount()}
					/>
				}
			</div>
		);
	}

	public handleCreateAccount() {
		this.store.createAccount();
	}
}
