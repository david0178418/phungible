import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';
import {
	Col,
	Form,
	FormGroup,
	Input,
	Label,
} from 'reactstrap';

import Account, {AccountType} from '../../shared/stores/account';
import AccountEditBalanceHistory from './account-edit-balance-history';

import './account-edit.scss';

type Props = {
	account?: Account;
	onSubmit(): void;
};

export default
observer(function AccountEdit({account, onSubmit}: Props) {
	const LEFT_COL = 4;
	const RIGHT_COL = 12 - LEFT_COL;

	return (
		<Form className="edit-account" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<FormGroup row>
				<Label sm={LEFT_COL}>Account Name</Label>
				<Col sm={RIGHT_COL}>
					<Input
						onChange={(ev: any) => handleUpdateName((ev.target as HTMLInputElement).value, account)}
						placeholder="Savings, Credit Card, etc"
						value={account.name}
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={LEFT_COL}>Type</Label>
				<Col sm={RIGHT_COL}>
					<Input
						defaultValue={account.type.toString()}
						onChange={(ev: any) => handleUpdateType(+(ev.target as HTMLSelectElement).value, account)}
						type="select"
					>
						<option value={AccountType.Savings}>Savings</option>
						<option value={AccountType.Debt}>Debt</option>
					</Input>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label sm={LEFT_COL}>Description</Label>
				<Col  sm={RIGHT_COL}>
					<Input
						onChange={(ev: any) => handleUpdateDescription((ev.target as HTMLInputElement).value, account)}
						type="text"
						value={account.description}
					/>
				</Col>
			</FormGroup>
			<AccountEditBalanceHistory
				account={account}
			/>
		</Form>
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
