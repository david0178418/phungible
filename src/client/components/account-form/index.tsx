import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Account, {AccountType} from '../../shared/stores/account';
import AccountEditBalanceHistory from './account-edit-balance-history';

type Props = {
	account?: Account;
	onSubmit(): void;
};

export default
observer(function AccountForm({account, onSubmit}: Props) {
	return (
		<form className="edit-account" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Account Name"
					value={account.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, account)) as any}
				/>
			</div>
			<div>
				<SelectField
					fullWidth
					floatingLabelText="Type"
					value={account.type}
					onChange={(ev, index, value) => handleUpdateType(value, account)}
				>
					<MenuItem value={AccountType.Debt} primaryText="Debt" />
					<MenuItem value={AccountType.Savings} primaryText="Savings" />
				</SelectField>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Description"
					value={account.description}
					onChange={((ev: any, value: any) => handleUpdateDescription(value, account)) as any}
				/>
			</div>
			<AccountEditBalanceHistory
				account={account}
			/>
		</form>
	);
});

const handleSubmit = action(function(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
	e.preventDefault();
	onSubmit();
});
const handleUpdateDescription = action(function(newDescription: string, account: Account) {
	account.description = newDescription;
});
const handleUpdateName = action(function(newName: string, account: Account) {
	account.name = newName;
});
const handleUpdateType = action(function(newType: AccountType, account: Account) {
	account.type = newType;
});