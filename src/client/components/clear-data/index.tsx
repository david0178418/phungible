import FloatingActionButton from 'material-ui/FloatingActionButton';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import * as React from 'react';
import {Component} from 'react';

import AppStore from '../../stores/app';

type Props = {
	store?: AppStore;
};

export default
class ClearData extends Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div
				style={{
					textAlign: 'center',
				}}
			>
				<p>
					Are you sure?  The data will <strong>not</strong> be recoverable.
				</p>
				<div>
					<FloatingActionButton
						backgroundColor="red"
						style={{
							marginTop: '75px',
						}}
						onTouchTap={() => this.handleClearData()}
					>
						<WarningIcon/>
					</FloatingActionButton>
				</div>
			</div>
		);
	}

	private handleClearData() {
		this.props.store.clearAllData();
		window.history.back();
	}
}
