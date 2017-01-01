import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import './app.scss';

const enum RepeatInterval {
	Daily,
	Weekdays,
	Weekly,
	Monthly,
	Yearly,
	None,
};

class BudgetItem {
	public amount: number;
	public label: string;
	public type: RepeatInterval;
	public startDate: string;
}

export
class AppStore {
	@observable public budgetItems: BudgetItem[];
}

@observer
export default
class App extends Component<any, any> {
	public store: AppStore;

	constructor(props: {}) {
		super(props);

		this.store = new AppStore();
	}

	public render() {
		const {
		} = this.store;

		return (
			<div>
				<form className="create-budget-item">
					<div className="form-group">
						<label>Name</label>
						<input type="text" className="form-control" placeholder="e.g. 'Car payment', 'Rent, 'Groceries'" />
					</div>
					<div className="form-group">
						<label>Amount</label>
						<div className="input-group">
							<span className="input-group-addon">
								$
							</span>
							<input type="number" className="form-control" step="10" placeholder="0.00" />
						</div>
					</div>
					<div className="form-group">
						<label>Starts</label>
						<input type="date" className="form-control" />
					</div>
					<div className="form-group">
						<label>
							Repeats
						</label>
						<select className="form-control" defaultValue={RepeatInterval.Monthly.toString()}>
							<option value={RepeatInterval.Daily}>Daily</option>
							<option value={RepeatInterval.Weekdays}>Weekdays</option>
							<option value={RepeatInterval.Weekly}>Weekly</option>
							<option value={RepeatInterval.Monthly}>Monthly</option>
							<option value={RepeatInterval.Yearly}>Yearly</option>
							<option value={RepeatInterval.None}>None</option>
						</select>
					</div>
					<button type="submit" className="btn btn-default">
						<span className="fa fa-plus"></span>
						Add Item
					</button>
				</form>
			</div>
		);
	}
}
