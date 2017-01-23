import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Account from '../../shared/stores/account';
import ScheduledTransaction, {RepeatUnits} from '../../shared/stores/scheduled-transaction';
import {TransactionType} from '../../shared/stores/transaction';
import AccountSelector from '../account-selector';

type Props = {
	accounts: Account[];
	scheduledTransaction: ScheduledTransaction;
	onSubmit(): void;
};

export default
observer(function ScheduledTransactionEdit({accounts, scheduledTransaction, onSubmit}: Props) {
	return (
		<form className="create-scheduled-transaction" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Name"
					value={scheduledTransaction.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, scheduledTransaction)) as any}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Amount"
					onChange={((ev: any, value: any) => handleUpdateAmount(value, scheduledTransaction)) as any}
					type="number"
					value={scheduledTransaction.prettyAmount}
				/>
			</div>
			<div>
				<SelectField
					fullWidth
					floatingLabelText="Type"
					value={scheduledTransaction.type}
					onChange={(ev, index, value) => handleUpdateType(value, scheduledTransaction)}
				>
					<MenuItem value={TransactionType.Income} primaryText="Income" />
					<MenuItem value={TransactionType.Expense} primaryText="Expense" />
				</SelectField>
			</div>
			<div>
				<DatePicker
					autoOk
					fullWidth
					floatingLabelText="Starts"
					hintText="Portrait Dialog"
					locale="en-US"
					onChange={(ev, date) => handleUpdateStartDate(date, scheduledTransaction)}
					value={scheduledTransaction.startDate}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Description"
					multiLine
					onChange={(ev: any) => handleUpdateDescription((ev.target as HTMLInputElement).value, scheduledTransaction)}
					value={scheduledTransaction.description}
				/>
			</div>
			{!!accounts.length && (
				<div>
					<AccountSelector
						accounts={accounts}
						label="From Account"
						onChange={(value) => handleUpdateFromAccount(value, scheduledTransaction)}
						selectedAccount={scheduledTransaction.fromAccount || false}
					/>
					<AccountSelector
						accounts={accounts}
						label="Towards Account"
						onChange={(value) => handleUpdateTowardAccount(value, scheduledTransaction)}
						selectedAccount={scheduledTransaction.towardAccount || false}
					/>
				</div>
			)}
			<div>
				<Checkbox
					checked={!scheduledTransaction.repeats}
					label="One-time entry"
					onClick={() => handleToggleRepeats(scheduledTransaction)}
					type="checkbox"
				/>
			</div>
			{scheduledTransaction.repeats && (
				<div>
					<div style={{display: 'flex'}}>
						<TextField
							onChange={((ev: any, value: any) => handleUpdateRepeatValue(value, scheduledTransaction)) as any}
							type="number"
							style={{width: 30}}
							value={scheduledTransaction.repeatValue}
							floatingLabelText="Every"
						/>
						<SelectField
							value={scheduledTransaction.repeatUnit}
							onChange={(ev, index, value) => handleUpdateRepeatUnit(value, scheduledTransaction)}
							floatingLabelText=" "
							style={{width: 'calc(100% - 30px)'}}
						>
							<MenuItem value={RepeatUnits.Day} primaryText="Day"/>
							<MenuItem value={RepeatUnits.Week} primaryText="Week"/>
							<MenuItem value={RepeatUnits.Month} primaryText="Month"/>
							<MenuItem value={RepeatUnits.Year} primaryText="Year"/>
						</SelectField>
					</div>
				</div>
			)}
		</form>
	);
});

const handleSubmit = action(function(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
	e.preventDefault();
	onSubmit();
});
const handleToggleRepeats = action(function(scheduledTransaction: ScheduledTransaction) {
	if(scheduledTransaction.repeats) {
		scheduledTransaction.repeatUnit = RepeatUnits.None;
	} else {
		scheduledTransaction.repeatUnit = RepeatUnits.Week;
	}
});
const handleUpdateFromAccount = action(
	function(account: Account, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.fromAccount = account;
	},
);
const handleUpdateTowardAccount = action(
	function(account: Account, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.towardAccount = account || null;
	},
);
const handleUpdateAmount = action(function(newAmount: number, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.amount = newAmount * 100;
});
const handleUpdateDescription = action(function(newDescription: string, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.description = newDescription;
});
const handleUpdateRepeatUnit = action(function(newRepeatUnit: RepeatUnits, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.repeatUnit = newRepeatUnit;
});
const handleUpdateRepeatValue = action(function(newRepeatValue: number, scheduledTransaction: ScheduledTransaction) {
	if(newRepeatValue > 0) {
		scheduledTransaction.repeatValue = newRepeatValue | 0;
	}
});
const handleUpdateName = action(function(newName: string, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.name = newName;
});
const handleUpdateStartDate = action(function(newDate: Date, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.startDate = newDate;
});
const handleUpdateType = action(function(newType: TransactionType, scheduledTransaction: ScheduledTransaction) {
	scheduledTransaction.type = newType;
});
