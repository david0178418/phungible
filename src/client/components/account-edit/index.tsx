import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import {DebtIcon, SavingsIcon} from '../../shared/shared-components';
import Account, {AccountType} from '../../stores/account';
import AccountEditBalanceHistory from './account-edit-balance-history';

type Props = {
	account: Account;
	onSubmit(): void;
};

export default
observer(function AccountEdit({account, onSubmit}: Props) {
	return (
		<form className="edit-account content" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div style={{display: 'flex'}}>
				<TextField
					fullWidth
					errorText={account.name ? '' : 'Name is requied'}
					floatingLabelText="Name"
					value={account.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, account)) as any}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<div
					style={{
						position: 'relative',
						width: 40,
					}}
				>
					{account.type === AccountType.Savings ?
						<SavingsIcon
							style={{
								bottom: 13,
								position: 'absolute',
							}}
						/> :
						<DebtIcon
							style={{
								bottom: 13,
								position: 'absolute',
							}}
						/>
					}
				</div>
				<SelectField
					fullWidth
					floatingLabelText="Type"
					value={account.type}
					onChange={(ev, index, value) => handleUpdateType(value, account)}
				>
					<MenuItem
						leftIcon={<SavingsIcon/>}
						primaryText="Availble Money"
						value={AccountType.Savings}
					/>
					<MenuItem
						leftIcon={<DebtIcon/>}
						primaryText="Debt"
						value={AccountType.Debt}
					/>
				</SelectField>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Notes"
					value={account.notes}
					onChange={((ev: any, value: any) => handleUpdateNotes(value, account)) as any}
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
const handleUpdateNotes = action(function(newNote: string, account: Account) {
	account.notes = newNote;
});
const handleUpdateName = action(function(newName: string, account: Account) {
	account.name = newName;
});
const handleUpdateType = action(function(newType: AccountType, account: Account) {
	account.type = newType;
});
