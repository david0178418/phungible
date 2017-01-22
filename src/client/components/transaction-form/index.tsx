import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Account from '../../shared/stores/account';
import Transaction, {TransactionType} from '../../shared/stores/transaction';
import AccountSelector from '../account-selector';

type Props = {
	accounts: Account[];
	transaction: Transaction;
	onSubmit(): void;
};

export default
observer(function TransactionForm({accounts, transaction, onSubmit}: Props) {
	return (
		<form className="edit-transaction" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Name"
					value={transaction.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, transaction)) as any}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Amount"
					onChange={((ev: any, value: any) => handleUpdateAmount(value, transaction)) as any}
					type="number"
					value={transaction.prettyAmount}
				/>
			</div>
			<div>
				<SelectField
					fullWidth
					floatingLabelText="Type"
					value={transaction.type}
					onChange={(ev, index, value) => handleUpdateType(value, transaction)}
				>
					<MenuItem value={TransactionType.Expense} primaryText="Expense" />
					<MenuItem value={TransactionType.Income} primaryText="Income" />
				</SelectField>
			</div>
			{!!accounts.length && (
				<div>
					<AccountSelector
						accounts={accounts}
						label="From Account"
						onChange={(value, index) => handleUpdateFromAccount(value, transaction)}
						selectedAccount={transaction.fromAccount}
					/>
					<AccountSelector
						accounts={accounts}
						label="Towards Account"
						onChange={(value, index) => handleUpdateTowardAccount(value, transaction)}
						selectedAccount={transaction.towardAccount}
					/>
				</div>
			)}
			<div>
				<DatePicker
					autoOk
					fullWidth
					floatingLabelText="Date"
					hintText="Portrait Dialog"
					locale="en-US"
					onChange={(ev, date) => handleUpdateDate(date, transaction)}
					value={transaction.date}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Notes"
					value={transaction.notes}
					onChange={((ev: any, value: any) => handleUpdateNotes(value, transaction)) as any}
				/>
			</div>
		</form>
	);
});

const handleSubmit = action(function(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
	e.preventDefault();
	onSubmit();
});
const handleUpdateAmount = action(function(newAmount: number, transaction: Transaction) {
	transaction.amount = newAmount * 100;
});
const handleUpdateFromAccount = action(
	function(account: Account, transaction: Transaction) {
		transaction.fromAccount = account;
	},
);
const handleUpdateTowardAccount = action(
	function(account: Account, transaction: Transaction) {
		transaction.towardAccount = account;
	},
);
const handleUpdateNotes = action(function(newNote: string, transaction: Transaction) {
	transaction.notes = newNote;
});
const handleUpdateName = action(function(newName: string, transaction: Transaction) {
	transaction.name = newName;
});
const handleUpdateDate = action(function(newDate: Date, transaction: Transaction) {
	transaction.date = newDate;
});
const handleUpdateType = action(function(newType: TransactionType, transaction: Transaction) {
	transaction.type = newType;
});