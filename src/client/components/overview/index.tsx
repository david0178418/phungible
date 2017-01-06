import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import {AppStore, BudgetEntry, BudgetType, RepeatUnits} from '../../global/types';

type Props = {
	store: AppStore;
};

function Row(budgetEntry: BudgetEntry) {
	return (
		<tr key={`${budgetEntry.name}+${budgetEntry.type}+${budgetEntry.amount}`}>
			<td>{budgetEntry.name}</td>
			<td>{BudgetType[budgetEntry.type]}</td>
			<td>${budgetEntry.prettyAmount}</td>
			<td>{budgetEntry.startDate.toLocaleDateString()}</td>
			<td>
				{budgetEntry.repeats ?
					`Every ${budgetEntry.repeatValue} ${RepeatUnits[budgetEntry.repeatUnit]}s` :
					'Never'
				}
			</td>
		</tr>
	);
}

@observer
export default
class Overview extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {
			budgetEntries,
		} = this.props.store;

		return (
			<div>
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Amount</th>
							<th>Start Date</th>
							<th>Repeats</th>
						</tr>
					</thead>
					<tbody>
						{budgetEntries.map(Row)}
					</tbody>
				</table>
			</div>
		);
	}
}
