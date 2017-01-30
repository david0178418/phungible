import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import Money from '../../shared/utils/money';

type Props = {
	money: Money;
};

@observer
export default
class MoneyEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {money} = this.props;
		return (
			<span>
				$
				<TextField
					name="dollars"
					onChange={((ev: any, value: any) => this.handleUpdateDollarAmount(value))}
					inputStyle={{ textAlign: 'right'}}
					style={{width: 75}}
					type="number"
					value={money.dollars}
				/>
				.
				<TextField
					name="cents"
					onChange={((ev: any, value: string) => this.handleUpdateCentsAmount(value))}
					style={{width: 40}}
					type="number"
					value={money.cents}
				/>
			</span>
		);
	}

	@action private handleUpdateCentsAmount(newAmount: string) {
		this.props.money.cents = +newAmount % 100;
	}
	@action private handleUpdateDollarAmount(newAmount: string) {
		this.props.money.dollars = +newAmount;
	}
}
