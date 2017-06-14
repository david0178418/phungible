import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import {Component} from 'react';

import {dialogStyles} from '../../shared/styles';

interface Props {
	updateAvailable: boolean;
}

interface State {
	ignoreUpdate: boolean;
}

export default
class UpdatePrompt extends Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			ignoreUpdate: false,
		};
	}

	public render() {
		return (
			<Dialog
				modal
				{...dialogStyles}
				open={this.props.updateAvailable && !this.state.ignoreUpdate}
				actions={[
					<FlatButton
						primary
						label="Later"
						onTouchTap={() => this.handleIgnoreUpdate()}
					/>,
					<FlatButton
						primary
						label="Restart and Update"
						onTouchTap={() => this.handleApplyUpdate()}
					/>,
				]}
			>
				An update is ready. Would you like to restart to apply it?
			</Dialog>
		);
	}

	private handleIgnoreUpdate() {
		this.setState({
			ignoreUpdate: true,
		});
	}

	private handleApplyUpdate() {
		window.location.reload();
	}
}
