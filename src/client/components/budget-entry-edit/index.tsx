import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Icon from  '../../shared/icon';
import BudgetEntry, {BudgetType, RepeatUnits} from '../../shared/stores/budget-entry';

type Props = {
	budgetEntry?: BudgetEntry;
	onSubmit(): void;
};

export default
observer(function BudgetEntryEdit({budgetEntry, onSubmit}: Props) {
	return (
		<form className="create-budget-entry" onSubmit={(ev) => handleSubmit(ev, onSubmit)}>
			<div className="form-group">
				<label>Name</label>
				<input
					className="form-control"
					onChange={(ev) => handleUpdateName((ev.target as HTMLInputElement).value, budgetEntry)}
					placeholder="e.g. 'Car payment', 'Rent, 'Groceries'"
					type="text"
					value={budgetEntry.name}
				/>
			</div>
			<div className="form-group">
				<label>Amount</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="usd" />
					</span>
					<input
						className="form-control"
						onChange={(ev) => handleUpdateAmount((ev.target as HTMLInputElement).valueAsNumber, budgetEntry)}
						placeholder="0.00"
						step={10}
						type="number"
						value={budgetEntry.prettyAmount}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>Type</label>
				<select
					className="form-control"
					defaultValue={budgetEntry.type.toString()}
					onChange={(ev) => handleUpdateType(+(ev.target as HTMLSelectElement).value, budgetEntry)}
				>
					<option value={BudgetType.Income}>Income</option>
					<option value={BudgetType.Expense}>Expense</option>
				</select>
			</div>
			<div className="form-group">
				<label>Starts</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="calendar" />
					</span>
					<input
						className="form-control TEMP_DATE_INPUT_FIX"
						onChange={(ev) => handleUpdateStartDate((ev.target as HTMLInputElement).valueAsDate, budgetEntry)}
						type="date"
						value={budgetEntry.inputFormattedDate}
					/>
				</div>
			</div>
			<div className="form-group">
				<label>Description</label>
				<input
					className="form-control"
					onChange={(ev) => handleUpdateDescription((ev.target as HTMLInputElement).value, budgetEntry)}
					type="text"
					value={budgetEntry.description}
				/>
			</div>
			<div className="row">
				<div className="col-sm-12">
					<label className="custom-control custom-checkbox">
						<input
							checked={!budgetEntry.repeats}
							className="custom-control-input"
							onChange={() => handleToggleRepeats(budgetEntry)}
							type="checkbox"
						/>
						<span className="custom-control-indicator"></span>
						<span className="custom-control-description">One-time entry</span>
					</label>
				</div>
			</div>
			{budgetEntry.repeats && (
				<div className="form-group">
					<div className="input-group">
						<label className="col-xs-5 col-sm-4 col-md-3 col-lg-2 col-form-label">Repeats Every</label>
						<div className="col-xs-3 col-md-2 col-lg-1">
							<input
								className="form-control"
								onChange={(ev) => handleUpdateRepeatValue((ev.target as HTMLInputElement).valueAsNumber, budgetEntry)}
								type="number"
								value={budgetEntry.repeatValue}
								step="1"
							/>
						</div>
						<div className="col-xs-4 col-sm-3 col-md-2">
							<select
								className="form-control"
								defaultValue={budgetEntry.repeatUnit.toString()}
								onChange={(ev) => handleUpdateRepeatUnit(+(ev.target as HTMLSelectElement).value, budgetEntry)}
							>
								<option value={RepeatUnits.Day}>Day</option>
								<option value={RepeatUnits.Week}>Week</option>
								<option value={RepeatUnits.Month}>Month</option>
								<option value={RepeatUnits.Year}>Year</option>
							</select>
						</div>
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
const handleToggleRepeats = action(function(budgetEntry: BudgetEntry) {
	if(budgetEntry.repeats) {
		budgetEntry.repeatUnit = RepeatUnits.None;
	} else {
		budgetEntry.repeatUnit = RepeatUnits.Month;
	}
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
