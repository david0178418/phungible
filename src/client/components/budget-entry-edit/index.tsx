import {observer} from 'mobx-react';
import {Component, FormEvent} from 'react';
import * as React from 'react';

import Icon from  '../../global/icon';
import {BudgetEntry, RepeatUnits} from '../../global/types';

type Props = {
	budgetEntry?: BudgetEntry;
	onSubmit(budgetEntry: BudgetEntry): void;
};

type State = {
	budgetEntry: BudgetEntry;
};

@observer
export default
class BudgetEntryEdit extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		let budgetEntry;

		if(props.budgetEntry) {
			budgetEntry = new BudgetEntry(props.budgetEntry);
		} else {
			budgetEntry = new BudgetEntry();
		}

		this.state = {
			budgetEntry,
		};
	}

	public render() {
		const {
			budgetEntry,
		} = this.state;
		return (
			<form className="create-budget-entry" onSubmit={(ev) => this.handleSubmit(ev)}>
				<div className="form-group row">
					<label>Name</label>
					<input
						className="form-control"
						onChange={(ev) => this.handleUpdateName((ev.target as HTMLInputElement).value)}
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
							onChange={(ev) => this.handleUpdateAmount((ev.target as HTMLInputElement).valueAsNumber)}
							placeholder="0.00"
							step={10}
							type="number"
							value={budgetEntry.prettyAmount}
						/>
					</div>
				</div>
				<div className="form-group row">
					<label>Starts</label>
					<div className="input-group">
						<span className="input-group-addon">
							<Icon type="calendar" />
						</span>
						<input
							className="form-control"
							onChange={(ev) => this.handleUpdateStartDate((ev.target as HTMLInputElement).valueAsDate)}
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
								onChange={() => this.handleToggleRepeats()}
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
									onChange={(ev) => this.handleUpdateRepeatValue((ev.target as HTMLInputElement).valueAsNumber)}
									type="number"
									value={budgetEntry.repeatValue}
									step="1"
								/>
							</div>
							<div className="col-xs-4 col-sm-3 col-md-2">
								<select
									className="form-control"
									defaultValue={budgetEntry.repeatUnit.toString()}
									onChange={(ev) => this.handleUpdateRepeatUnit(+(ev.target as HTMLSelectElement).value)}
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
				<button type="submit" className="btn btn-primary" disabled={!budgetEntry.isValid}>
					<Icon type="plus" />
					{' Add Entry'}
				</button>
			</form>
		);
	}

	private handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		this.props.onSubmit(this.state.budgetEntry);
	}
	private handleToggleRepeats() {
		if(this.state.budgetEntry.repeats) {
			this.state.budgetEntry.repeatUnit = RepeatUnits.None;
		} else {
			this.state.budgetEntry.repeatUnit = RepeatUnits.Month;
		}
	}
	private handleUpdateAmount(newAmount: number) {
		this.state.budgetEntry.amount = newAmount * 100;
	}
	private handleUpdateRepeatUnit(newRepeatUnit: RepeatUnits) {
		this.state.budgetEntry.repeatUnit = newRepeatUnit;
	}
	private handleUpdateRepeatValue(newRepeatValue: number) {
		if(newRepeatValue > 0) {
			this.state.budgetEntry.repeatValue = newRepeatValue | 0;
		}
	}
	private handleUpdateName(newName: string) {
		this.state.budgetEntry.name = newName;
	}
	private handleUpdateStartDate(newDate: Date) {
		this.state.budgetEntry.startDate = newDate;
	}
}
