import * as React from 'react';

import Icon from  '../../global/icon';
import {BudgetEntry, RepeatUnits} from '../../global/types';

type Props = {
	budgetEntry: BudgetEntry;
};

export default
function BudgetEntryEdit({budgetEntry}: Props) {
	return (
		<form className="create-budget-entry">
			<div className="form-group row">
				<label>Name</label>
				<input
					className="form-control"
					placeholder="e.g. 'Car payment', 'Rent, 'Groceries'"
					type="text"
				/>
			</div>
			<div className="form-group row">
				<label>Amount</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="usd" />
					</span>
					<input type="number" className="form-control" step="10" placeholder="0.00" />
				</div>
			</div>
			<div className="form-group row">
				<label>Starts</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="calendar" />
					</span>
					<input type="date" className="form-control" />
				</div>
			</div>
			<div className="row">
				<div className="col-sm-12">
					<label className="custom-control custom-checkbox">
						<input type="checkbox" className="custom-control-input" />
						<span className="custom-control-indicator"></span>
						<span className="custom-control-description">One-time entry</span>
					</label>
				</div>
			</div>
			<div className="form-group row">
				<div className="input-group">
					<label className="col-xs-5 col-sm-4 col-md-3 col-lg-2 col-form-label">Repeats Every</label>
					<div className="col-xs-3 col-md-2 col-lg-1">
						<input className="form-control" type="number" value={budgetEntry.repeatValue} step="1"/>
					</div>
					<div className="col-xs-4 col-sm-3 col-md-2">
						<select className="form-control" defaultValue={budgetEntry.repeatValue.toString()}>
							<option value={RepeatUnits.Day}>Day</option>
							<option value={RepeatUnits.Week}>Week</option>
							<option value={RepeatUnits.Month}>Month</option>
							<option value={RepeatUnits.Year}>Year</option>
						</select>
					</div>
				</div>
			</div>
			<button type="submit" className="btn btn-primary">
				<Icon type="plus" />
				{' Add Entry'}
			</button>
		</form>
	);
}
