import * as React from 'react';

import Icon from  '../global/icon';
import {RepeatInterval} from '../global/types';

export default
function CreateBudgetEntry() {
	return (
		<form className="create-budget-entry">
			<div className="form-group">
				<label>Name</label>
				<input type="text" className="form-control" placeholder="e.g. 'Car payment', 'Rent, 'Groceries'" />
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
			<button type="submit" className="btn btn-default">
				<Icon type="plus" />
				{' Add Entry'}
			</button>
		</form>
	);
}
