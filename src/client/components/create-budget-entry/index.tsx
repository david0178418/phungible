import * as React from 'react';

import Icon from  '../../global/icon';
import {BudgetItem, RepeatInterval} from '../../global/types';

export default
function CreateBudgetEntry(props: BudgetItem) {
	return (
		<form className="create-budget-entry">
			<div className="form-group">
				<label>Name</label>
				<input
					className="form-control"
					placeholder="e.g. 'Car payment', 'Rent, 'Groceries'"
					type="text"
				/>
			</div>
			<div className="form-group">
				<label>Amount</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="usd" />
					</span>
					<input type="number" className="form-control" step="10" placeholder="0.00" />
				</div>
			</div>
			<div className="form-group">
				<label>Starts</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="calendar" />
					</span>
					<input type="date" className="form-control" />
				</div>
			</div>
			<div className="form-group">
				<label>
					Repeats
				</label>
				<div className="input-group">
					<span className="input-group-addon">
						<Icon type="repeat" />
					</span>
					<select className="form-control" defaultValue={RepeatInterval.Monthly.toString()}>
						<option value={RepeatInterval.Daily}>Daily</option>
						<option value={RepeatInterval.Weekdays}>Weekdays</option>
						<option value={RepeatInterval.Weekly}>Weekly</option>
						<option value={RepeatInterval.Monthly}>Monthly</option>
						<option value={RepeatInterval.Yearly}>Yearly</option>
						<option value={RepeatInterval.None}>None</option>
					</select>
				</div>
			</div>
			<button type="submit" className="btn btn-primary">
				<Icon type="plus" />
				{' Add Entry'}
			</button>
		</form>
	);
}
