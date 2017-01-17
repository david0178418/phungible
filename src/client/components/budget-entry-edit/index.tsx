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
import AppStore from '../../shared/stores/app';
import BudgetEntry, {BudgetType, RepeatUnits} from '../../shared/stores/budget-entry';

type Props = {
	accounts: Account[];
	appStore: AppStore;
	budgetEntry: BudgetEntry;
	onSubmit(): void;
};

export default
observer(function BudgetEntryEdit({accounts, appStore, budgetEntry, onSubmit}: Props) {
	return (
		<form className="create-budget-entry" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Name"
					value={budgetEntry.name}
					onChange={((ev: any, value: any) => handleUpdateName(value, budgetEntry)) as any}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Transaction Amount"
					onChange={((ev: any, value: any) => handleUpdateAmount(value, budgetEntry)) as any}
					type="number"
					value={budgetEntry.prettyAmount}
				/>
			</div>
			<div>
				<SelectField
					fullWidth
					floatingLabelText="Type"
					value={budgetEntry.type}
					onChange={(ev, index, value) => handleUpdateType(value, budgetEntry)}
				>
					<MenuItem value={BudgetType.Income} primaryText="Income" />
					<MenuItem value={BudgetType.Expense} primaryText="Expense" />
				</SelectField>
			</div>
			<div>
				<DatePicker
					autoOk
					fullWidth
					floatingLabelText="Starts"
					hintText="Portrait Dialog"
					locale="en-US"
					onChange={(ev, date) => handleUpdateStartDate(date, budgetEntry)}
					value={budgetEntry.startDate}
				/>
			</div>
			<div>
				<TextField
					fullWidth
					floatingLabelText="Description"
					multiLine
					onChange={(ev: any) => handleUpdateDescription((ev.target as HTMLInputElement).value, budgetEntry)}
					value={budgetEntry.description}
				/>
			</div>
			<div>
				<Checkbox
					checked={!budgetEntry.repeats}
					label="One-time entry"
					onClick={() => handleToggleRepeats(budgetEntry)}
					type="checkbox"
				/>
			</div>
			{budgetEntry.repeats && (
				<div>
					<div style={{display: 'flex'}}>
						<TextField
							onChange={((ev: any, value: any) => handleUpdateRepeatValue(value, budgetEntry)) as any}
							type="number"
							style={{width: 30}}
							value={budgetEntry.repeatValue}
							floatingLabelText="Every"
						/>
						<SelectField
							value={budgetEntry.repeatUnit}
							onChange={(ev, index, value) => handleUpdateRepeatUnit(value, budgetEntry)}
							floatingLabelText=" "
							style={{width: 'calc(100% - 30px)'}}
						>
							<MenuItem value={RepeatUnits.Day} primaryText="Day"/>
							<MenuItem value={RepeatUnits.Week} primaryText="Week"/>
							<MenuItem value={RepeatUnits.Month} primaryText="Month"/>
							<MenuItem value={RepeatUnits.Year} primaryText="Year"/>
						</SelectField>
					</div>
					{!!accounts.length && (
						<div>
							<SelectField
								fullWidth
								floatingLabelText="Towards Account"
								value={budgetEntry.account ? budgetEntry.account.id : 0}
								onChange={(ev, index, value) => handleUpdateAccount(value, budgetEntry, appStore)}
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
						</div>
					)}
				</div>
			)}
		</form>
	);
});

const handleSubmit = action(function(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
	e.preventDefault();
	onSubmit();
});
const handleToggleRepeats = action(function(budgetEntry: BudgetEntry) {
	if(budgetEntry.repeats) {
		budgetEntry.repeatUnit = RepeatUnits.None;
	} else {
		budgetEntry.repeatUnit = RepeatUnits.Week;
	}
});
const handleUpdateAccount = action(function(accountId: number, budgetEntry: BudgetEntry, appStore: AppStore) {
	budgetEntry.account = appStore.findAccount(accountId);
});
const handleUpdateAmount = action(function(newAmount: number, budgetEntry: BudgetEntry) {
	budgetEntry.amount = newAmount * 100;
});
const handleUpdateDescription = action(function(newDescription: string, budgetEntry: BudgetEntry) {
	budgetEntry.description = newDescription;
});
const handleUpdateRepeatUnit = action(function(newRepeatUnit: RepeatUnits, budgetEntry: BudgetEntry) {
	budgetEntry.repeatUnit = newRepeatUnit;
});
const handleUpdateRepeatValue = action(function(newRepeatValue: number, budgetEntry: BudgetEntry) {
	if(newRepeatValue > 0) {
		budgetEntry.repeatValue = newRepeatValue | 0;
	}
});
const handleUpdateName = action(function(newName: string, budgetEntry: BudgetEntry) {
	budgetEntry.name = newName;
});
const handleUpdateStartDate = action(function(newDate: Date, budgetEntry: BudgetEntry) {
	budgetEntry.startDate = newDate;
});
const handleUpdateType = action(function(newType: BudgetType, budgetEntry: BudgetEntry) {
	budgetEntry.type = newType;
});
