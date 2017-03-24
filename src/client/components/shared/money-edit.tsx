import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Money from '../../shared/utils/money';

type Props = {
	money: Money;
	style?: object;
};

@observer
export default
class MoneyEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {money, style} = this.props;
		return (
			<div style={style}>
				<TextField
					inputStyle={{ textAlign: 'right'}}
					name="dollars"
					floatingLabelFixed
					floatingLabelText="$"
					style={{
						width: 75,
					}}
					type="number"
					value={money.dollars}
					onChange={((ev: any, value: any) => this.handleUpdateDollarAmount(value))}
					onFocus={(e) => (e.target as any).select()}
				/>
				.
				<TextField
					name="cents"
					floatingLabelFixed
					floatingLabelText=" "
					style={{width: 40}}
					type="number"
					value={money.cents}
					onChange={((ev: any, value: string) => this.handleUpdateCentsAmount(value))}
					onFocus={(e) => (e.target as any).select()}
				/>
			</div>
		);
	}

	@action private handleUpdateCentsAmount(newAmount: string) {
		this.props.money.cents = +newAmount % 100;
	}
	@action private handleUpdateDollarAmount(newAmount: string) {
		this.props.money.dollars = +newAmount;
	}
}
