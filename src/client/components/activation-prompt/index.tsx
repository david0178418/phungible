import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component, KeyboardEvent} from 'react';

import {activate} from '../../shared/api';

interface Props {
	open: boolean;
	onActivation(): void;
}

class ActivationPromptStore {
	@observable public busy = false;
	@observable public invalid = false;
	@observable public code = '';

	@computed get canSubmit() {
		return !this.busy && (this.code.length === 4);
	}

	@action public setCode(newCode: string) {
		this.code = newCode.substr(0, 4).toUpperCase();
	}

	@action public setBusy(busyState: boolean) {
		this.busy = busyState;
	}

	@action public setInvalid(invalidState: boolean) {
		this.invalid = invalidState;
	}

}

@observer
export default
class ActivationPrompt extends Component<Props, {}> {
	private store: ActivationPromptStore;

	constructor(props: Props) {
		super(props);
		this.store = new ActivationPromptStore();
	}

	public render() {
		const {
			open,
		} = this.props;
		const {
			canSubmit,
			code,
			invalid,
		} = this.store;

		return (
			<Dialog
				modal
				open={open}
				title="Welcome to the Phungible Closed Beta"
				titleStyle={{
					textAlign: 'center',
				}}
				actions={[
					<RaisedButton
						label="Submit"
						disabled={!canSubmit}
						onTouchTap={() => this.handleSubmit()}
					/>,
				]}
				style={{
					textAlign: 'center',
				}}
			>
				<TextField
					disabled={this.store.busy}
					hintText="Enter your Phungible beta code"
					errorText={invalid ? 'Code is not valid' : ''}
					value={code}
					onChange={(e, val) => this.handleCodeUpdate(val)}
					onKeyUp={(e) => this.handleKeyUp(e)}
					inputStyle={{
						textAlign: 'center',
					}}
				/>
				<p>
					If you do not have a code, you may sign up for access at{' '}
					<a href="https://Phungible.com/">Phungible.com/</a>.
				</p>
			</Dialog>
		);
	}

	private handleCodeUpdate(code: string) {
		this.store.setCode(code);
	}

	private handleKeyUp(e: KeyboardEvent<{}>) {
		if(e.keyCode === 13) {
			this.handleSubmit();
		}
	}

	private handleSubmit() {
		this.store.setBusy(true);
		activate(this.store.code)
			.then((isActivated) => {
				if(isActivated) {
					this.props.onActivation();
				} else {
					this.store.setBusy(false);
					this.store.setInvalid(true);
				}
			});
	}
}
