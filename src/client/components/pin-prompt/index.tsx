import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

interface PinProps {
	length: number;
}

@observer
class Pin extends Component<PinProps, {}> {
	public render() {
		const {length} = this.props;
		const digits = [];

		for(let x = 0; x < length; x++) {
			digits.push(
				<div key={x} style={{
					width: '25%',
				}}>
					*
				</div>,
			);
		}

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				fontSize: '26px',
				fontWeight: 'bold',
				height: 31,
				textAlign: 'center',
			}}>
				{!length && (
					<div style={{
						fontSize: 20,
						fontWeight: 'lighter',
						width: '93%',
					}}>
						<em>4 digit pin</em>
					</div>
				)}
				{digits}
			</div>
		);
	}
}

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

interface Props {
	title?: string;
	busy?: boolean;
	open: boolean;
	pin: string;
	onClearPin?: () => void;
	onCancel?: () => void;
	onPinUpdate(pin: string): void;
}

class PinPromptStore {
	@observable public pin = '';
}

@observer
export default
class PinPrompt extends Component<Props, {}> {
	private store: PinPromptStore;

	constructor(props: Props) {
		super(props);
		this.store = new PinPromptStore();
	}

	public render() {
		const {
			title,
			open,
			onClearPin,
			onCancel,
			pin,
		} = this.props;
		const actions = [];

		if(onClearPin) {
			actions.push(
				<RaisedButton
					label="Clear"
					onTouchTap={onClearPin}
				/>,
			);
		}

		if(onCancel) {
			actions.push(
			<RaisedButton
				label="Cancel"
				onTouchTap={onCancel}
			/>,
			);
		}

		return (
			<Dialog
				modal
				open={open}
				title={title ? title : 'Enter your pin'}
				actions={actions}
				contentStyle={{
					transform: 'none',
					width: '90%',
				}}
				bodyStyle={{
					minHeight: 330,
				}}
			>
				<Pin length={pin.length}/>
				<div
					style={{
						display: 'flex',
						flexFlow: 'row wrap',
						justifyContent: 'flex-start',
					}}
				>
					{NUMBERS.map((num) => (
						<RaisedButton
							secondary
							key={num}
							label={num}
							onTouchTap={() => this.handleUpdatePin(num)}
							style={{
								flex: '0 0 30%',
								margin: num === '0' ? '1% 33%' : '1%',
								minWidth: 'auto',
							}}
							buttonStyle={{
								height: 70,
							}}
						/>
					))}
				</div>
			</Dialog>
		);
	}

	private handleUpdatePin(num: string) {
		setTimeout(() => {
			if(window.navigator.vibrate) {
				window.navigator.vibrate(100);
			}

			this.props.onPinUpdate(this.props.pin + num);
		}, 4);
	}
}
