import * as React from 'react';

import ScheduledTransaction from '../../stores/scheduled-transaction';

class State {
}

interface Props {
	scheduledTransactions: ScheduledTransaction[];
}

export default
class CreateScheduledTransactionsStep extends React.Component<Props, State> {
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
				Scheduled Transations {this.props.scheduledTransactions.length}
			</div>
		);
	}
}
