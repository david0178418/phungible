import * as React from 'react';

class State {
}

interface Props {
	accounts: Account[];
}

export default
class CreateAccountsStep extends React.Component<Props, State> {
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
				Accounts: {this.props.accounts.length}
			</div>
		);
	}
}
