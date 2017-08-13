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
	model: Account;
	onSubmit(): void;
};

export default
observer(function AccountEdit({model, onSubmit}: Props) {
	return (
		<form className="edit-account content" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div style={{display: 'flex'}}>
				<TextField
					fullWidth
					errorText={model.name ? '' : 'Name is requied'}
					floatingLabelText="Name"
					value={model.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, model)) as any}
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
					{model.type === AccountType.Savings ?
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
					value={model.type}
					onChange={(ev, index, value) => handleUpdateType(value, model)}
				>
					<MenuItem
						leftIcon={<SavingsIcon/>}
						primaryText="Available Money"
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
					value={model.notes}
					onChange={((ev: any, value: any) => handleUpdateNotes(value, model)) as any}
				/>
			</div>
			<AccountEditBalanceHistory
				account={model}
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
