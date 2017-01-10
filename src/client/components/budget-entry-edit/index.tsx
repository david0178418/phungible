import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';

import Icon from  '../../global/icon';
import {BudgetEntry, BudgetType, RepeatUnits} from '../../global/types';

type Props = {
	budgetEntry?: BudgetEntry;
	onSubmit(): boolean;
};

export default
observer(function BudgetEntryEdit({budgetEntry, onSubmit}: Props) {
	return (
		<form className="create-budget-entry" onSubmit={(ev) => handleSubmit(ev, onSubmit)}>
			<div className="form-group row">
				<label>Name</label>
				<input
					className="form-control"
					onChange={(ev) => handleUpdateName((ev.target as HTMLInputElement).value, budgetEntry)}
					placeholder="e.g. 'Car payment', 'Rent, 'Groceries'"
					type="text"
					value={budgetEntry.name}
				/>
			</div>
			<div className="form-group row">
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
			<div className="form-group row">
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
			<div className="form-group row">
				<label>Starts</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="calendar" />
					</span>
					<input
						className="form-control"
						onChange={(ev) => handleUpdateStartDate((ev.target as HTMLInputElement).valueAsDate, budgetEntry)}
						type="date"
						value={budgetEntry.inputFormattedDate}
					/>
				</div>
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
				<div className="form-group row">
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

function handleSubmit(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
	e.preventDefault();
	onSubmit();
}
function handleToggleRepeats(budgetEntry: BudgetEntry) {
	if(budgetEntry.repeats) {
		budgetEntry.repeatUnit = RepeatUnits.None;
	} else {
		budgetEntry.repeatUnit = RepeatUnits.Month;
	}
}
function handleUpdateAmount(newAmount: number, budgetEntry: BudgetEntry) {
	budgetEntry.amount = newAmount * 100;
}
function handleUpdateRepeatUnit(newRepeatUnit: RepeatUnits, budgetEntry: BudgetEntry) {
	budgetEntry.repeatUnit = newRepeatUnit;
}
function handleUpdateRepeatValue(newRepeatValue: number, budgetEntry: BudgetEntry) {
	if(newRepeatValue > 0) {
		budgetEntry.repeatValue = newRepeatValue | 0;
	}
}
function handleUpdateName(newName: string, budgetEntry: BudgetEntry) {
	budgetEntry.name = newName;
}
function handleUpdateStartDate(newDate: Date, budgetEntry: BudgetEntry) {
	budgetEntry.startDate = newDate;
}
function handleUpdateType(newType: BudgetType, budgetEntry: BudgetEntry) {
	budgetEntry.type = newType;
}
