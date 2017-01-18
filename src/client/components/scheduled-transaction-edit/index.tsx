import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-forward';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Account from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import ScheduledTransaction, {RepeatUnits, TransactionType} from '../../shared/stores/scheduled-transaction';

type Props = {
	accounts: Account[];
	appStore: AppStore;
	scheduledTransaction: ScheduledTransaction;
	onSubmit(): void;
};

type AccountSelectorProps = {
	accounts: Account[];
	label: string;
	selectedAccount: number;
	style: {}
	onChange(value: number): void;
};

const AccountsSelector = function({accounts, label, onChange, selectedAccount, style}: AccountSelectorProps) {
	return (
		<SelectField
			fullWidth
			floatingLabelText={label}
			value={selectedAccount}
			onChange={(ev, index, value) => onChange(value)}
			style={style}
		>
			<MenuItem value={0} primaryText="None" />
			{accounts.map((account) => {
				return (
					<MenuItem
						key={account.id}
						value={account.id}
						primaryText={account.name}
					/>
				);
			})}
		</SelectField>
	);
};

export default
observer(function ScheduledTransactionEdit({accounts, appStore, scheduledTransaction, onSubmit}: Props) {
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
					<AccountsSelector
						accounts={accounts}
						label="From Account"
						onChange={(value) => handleUpdateFromAccount(value, scheduledTransaction, appStore)}
						selectedAccount={scheduledTransaction.fromAccount ? scheduledTransaction.fromAccount.id : 0}
						style={{width: 'calc(50% - 12px)'}}
					/>
					<NavigationArrowBack
						style={{
							marginTop: '32px',
							verticalAlign: 'top',
						}}
					/>
					<AccountsSelector
						accounts={accounts}
						label="Towards Account"
						onChange={(value) => handleUpdateTowardAccount(value, scheduledTransaction, appStore)}
						selectedAccount={scheduledTransaction.towardAccount ? scheduledTransaction.towardAccount.id : 0}
						style={{width: 'calc(50% - 12px)'}}
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
	function(accountId: number, scheduledTransaction: ScheduledTransaction, appStore: AppStore) {
		scheduledTransaction.fromAccount = appStore.findAccount(accountId);
	},
);
const handleUpdateTowardAccount = action(
	function(accountId: number, scheduledTransaction: ScheduledTransaction, appStore: AppStore) {
		scheduledTransaction.towardAccount = appStore.findAccount(accountId);
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
