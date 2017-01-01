import 'bootstrap/scss/bootstrap.scss';
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
				<form>
					<div className="form-group create-budget-item">
						<div className="input-group">
							<span className="input-group-addon">
								Name
							</span>
							<input type="text" className="form-control" placeholder="e.g. 'Car payment', 'Rent, 'Groceries'" />
						</div>
						<div className="input-group">
							<span className="input-group-addon">
								$
							</span>
							<input type="number" className="form-control" step="10" placeholder="0.00" />
						</div>
						<div className="input-group">
							<span className="input-group-addon">
								Starts
							</span>
							<input type="date" className="form-control" />
						</div>
						<div className="input-group">
							<span className="input-group-addon">
								Repeats
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
				</form>
			</div>
		);
	}
}
