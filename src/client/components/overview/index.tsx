import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import {AppStore, BudgetEntry} from '../../global/types';

type Props = {
	store: AppStore;
};

function Row(budgetEntry: BudgetEntry) {
	return (
		<tr>
			<td>{budgetEntry.name}</td>
			<td>${budgetEntry.prettyAmount}</td>
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
							<th>Amount</th>
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
