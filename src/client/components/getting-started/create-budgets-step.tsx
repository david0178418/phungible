import * as React from 'react';

import ScheduledTransaction from '../../stores/scheduled-transaction';

class State {
}

interface Props {
	budgets: ScheduledTransaction[];
}

export default
class CreateBudgetsStep extends React.Component<Props, State> {
	private store: State;

	constructor(props: Props) {
		super(props);
		this.store = new State();
	}

	public render() {
		const {
		} = this.store;
		return (
			<div>
				Budgets: {this.props.budgets.length}
			</div>
		);
	}
}
