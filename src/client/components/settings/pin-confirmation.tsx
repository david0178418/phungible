import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import PinPrompt from '../pin-prompt';

interface Props {
	open: boolean;
	onConfirm(pin: string): void;
	onCancel(): void;
}

class PinConfirmationStore {
	@observable public entry1 = '';
	@observable public entry2 = '';

	@computed get currentPin() {
		if(this.entry1.length < 4) {
			return this.entry1;
		}

		if(this.entry2.length < 4) {
			return this.entry2;
		}

		return '';
	}

	@computed get firstEntryComplete() {
		return this.entry1.length === 4;
	}

	@computed get entryCompleted() {
		return this.entry1.length === 4 && this.entry2.length === 4;
	}

	@computed get entriesMatch() {
		return this.entry1 === this.entry2;
	}

	get entryFailed() {
		// Was computed, but wasn't updating as expected
		return this.entryCompleted && !this.entriesMatch;
	}

	@action public reset() {
		this.entry1 = '';
		this.entry2 = '';
	}

	@action public updateCurrentPin(pin: string) {
		if(this.entry1.length < 4) {
			this.entry1 = pin;
		} else if(this.entry2.length < 4) {
			this.entry2 = pin;
		}
	}
}

@observer
export default
class PinConfirmation extends Component<Props, {}> {
	private store: PinConfirmationStore;
	constructor(props: Props) {
		super(props);
		this.store = new PinConfirmationStore();
	}

	public render() {
		const {
			open,
		} = this.props;
		const {
			firstEntryComplete,
			currentPin,
		} = this.store;

		return (
			<div>
				<PinPrompt
					title={firstEntryComplete ?
						'Confirm pin' :
						'Enter pin'
					}
					open={open}
					pin={currentPin}
					onPinUpdate={(pin) => this.handlePinUpdate(pin)}
					onCancel={() => this.handleCancel()}
				/>
				<Dialog
					modal
					open={this.store.entryFailed && open}
					title="Error"
					actions={[
						<FlatButton
							label="Close"
							primary
							onTouchTap={() => this.handleCancel()}
						/>,
						<FlatButton
							label="Retry"
							primary
							onTouchTap={() => this.handleRetry()}
						/>,
					]}
				>
					Pins to not match
				</Dialog>
			</div>
		);
	}

	private handleRetry() {
		this.store.reset();
	}

	private handleCancel() {
		this.props.onCancel();
		this.store.reset();
	}

	private handlePinUpdate(pin: string) {
		this.store.updateCurrentPin(pin);

		if(this.store.entryCompleted) {
			if(this.store.entriesMatch) {
				this.props.onConfirm(this.store.entry1);
				this.store.reset();
			}
		}
	}
}
