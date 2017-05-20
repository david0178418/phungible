import {assign} from 'lodash';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Money from '../../shared/utils/money';

interface State {
	labelValue: string;
}

interface Props {
	money: Money;
	style?: object;
}

@observer
export default
class MoneyEdit extends Component<Props, State> {
	private textInput: TextField;

	public render() {
		const {money, style} = this.props;
		return (
			<div style={assign({}, style)}>
				<TextField
					inputStyle={{ textAlign: 'right'}}
					name="dollars"
					floatingLabelFixed
					floatingLabelText="$"
					style={{
						width: 75,
					}}
					type="number"
					value={money.valFixed}
					ref={(input) => this.textInput = input}
					onBlur={() => this.handleBlur()}
					onChange={((ev: any, value: any) => this.handleUpdateAmount(value))}
					onFocus={(e) => (e.target as any).select()}
				/>
			</div>
		);
	}
	private handleBlur() {
		this.textInput.getInputNode().value = this.props.money.valFixed;
	}
	@action private handleUpdateAmount(newAmount: string) {
		this.props.money.val = +newAmount;
	}
}
