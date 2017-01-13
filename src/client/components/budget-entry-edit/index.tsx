import {action} from 'mobx';
import {observer} from 'mobx-react';
import {FormEvent} from 'react';
import * as React from 'react';
import {
	Col,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
} from 'reactstrap';

import Icon from '../../shared/icon';
import BudgetEntry, {BudgetType, RepeatUnits} from '../../shared/stores/budget-entry';

type Props = {
	budgetEntry?: BudgetEntry;
	onSubmit(): void;
};

export default
observer(function BudgetEntryEdit({budgetEntry, onSubmit}: Props) {
	return (
		<Form className="create-budget-entry" onSubmit={(ev: any) => handleSubmit(ev, onSubmit)}>
			<FormGroup>
				<Label>Name</Label>
				<Input
					onChange={(ev: any) => handleUpdateName((ev.target as HTMLInputElement).value, budgetEntry)}
					placeholder="e.g. 'Car payment', 'Rent, 'Groceries'"
					value={budgetEntry.name}
				/>
			</FormGroup>
			<FormGroup>
				<Label>Amount</Label>
				<InputGroup>
					<InputGroupAddon>
						<Icon type="usd" />
					</InputGroupAddon>
					<Input
						onChange={(ev: any) => handleUpdateAmount((ev.target as HTMLInputElement).valueAsNumber, budgetEntry)}
						placeholder="0.00"
						step={10}
						type="number"
						value={budgetEntry.prettyAmount}
					/>
				</InputGroup>
			</FormGroup>
			<FormGroup>
				<Label>Type</Label>
				<Input
					defaultValue={budgetEntry.type.toString()}
					onChange={(ev: any) => handleUpdateType(+(ev.target as HTMLSelectElement).value, budgetEntry)}
					type="select"
				>
					<option value={BudgetType.Income}>Income</option>
					<option value={BudgetType.Expense}>Expense</option>
				</Input>
			</FormGroup>
			<FormGroup>
				<Label>Starts</Label>
				<InputGroup>
					<InputGroupAddon>
						<Icon type="calendar" />
					</InputGroupAddon>
					<Input
						className="TEMP_DATE_INPUT_FIX"
						onChange={(ev: any) => handleUpdateStartDate((ev.target as HTMLInputElement).valueAsDate, budgetEntry)}
						type="date"
						value={budgetEntry.inputFormattedDate}
					/>
				</InputGroup>
			</FormGroup>
			<FormGroup>
				<Label>Description</Label>
				<Input
					onChange={(ev: any) => handleUpdateDescription((ev.target as HTMLInputElement).value, budgetEntry)}
					value={budgetEntry.description}
				/>
			</FormGroup>
			<FormGroup row>
				<Col sm={12}>
					<Label className="custom-control custom-checkbox">
						<input
							checked={!budgetEntry.repeats}
							className="custom-control-input"
							onChange={() => handleToggleRepeats(budgetEntry)}
							type="checkbox"
						/>
						<span className="custom-control-indicator"></span>
						<span className="custom-control-description">One-time entry</span>
					</Label>
				</Col>
			</FormGroup>
			{budgetEntry.repeats && (
				<FormGroup row>
					<Label md={4} lg={3}>
						Repeats Every
					</Label>
					<Col md={3} lg={2}>
						<Input
							onChange={(ev: any) => handleUpdateRepeatValue((ev.target as HTMLInputElement).valueAsNumber, budgetEntry)}
							type="number"
							value={budgetEntry.repeatValue}
							step="1"
						/>
					</Col>
					<Col md={4} lg={3}>
						<Input
							type="select"
							defaultValue={budgetEntry.repeatUnit.toString()}
							onChange={(ev: any) => handleUpdateRepeatUnit(+(ev.target as HTMLSelectElement).value, budgetEntry)}
						>
							<option value={RepeatUnits.Day}>Day</option>
							<option value={RepeatUnits.Week}>Week</option>
							<option value={RepeatUnits.Month}>Month</option>
							<option value={RepeatUnits.Year}>Year</option>
						</Input>
					</Col>
				</FormGroup>
			)}
		</Form>
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
