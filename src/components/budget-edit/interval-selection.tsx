import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import Budget, {RepeatUnits} from '../../stores/budget';

const { Component } = React;

type Props = {
	budget: Budget;
};

@observer
export default
class IntervalSelection extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {budget} = this.props;
		return (
			<div style={{display: 'flex'}}>
				<TextField
					floatingLabelText="Every"
					onChange={((ev: any, value: any) => this.handleUpdateRepeatValue(value, budget)) as any}
					onFocus={(e) => (e.target as any).select()}
					style={{width: 50}}
					type="number"
					value={budget.repeatValues[0]}
				/>
				<SelectField
					value={budget.repeatUnit}
					onChange={(ev, index, value) => this.handleUpdateRepeatUnit(value, budget)}
					floatingLabelText=" "
					style={{width: 'calc(100% - 50px)'}}
				>
					<MenuItem value={RepeatUnits.Day} primaryText="Day"/>
					<MenuItem value={RepeatUnits.Week} primaryText="Week"/>
					<MenuItem value={RepeatUnits.Month} primaryText="Month"/>
					<MenuItem value={RepeatUnits.Year} primaryText="Year"/>
				</SelectField>
			</div>
		);
	}

	@action private handleUpdateRepeatUnit(newRepeatUnit: RepeatUnits, scheduledTransaction: Budget) {
		scheduledTransaction.repeatUnit = newRepeatUnit;
	}
	@action private handleUpdateRepeatValue(newRepeatValue: string, scheduledTransaction: Budget) {
		let num = +newRepeatValue;
		if(!isNaN(num)) {
			if(num <= 0) {
				num = 1;
			}

			if(num > 400) {
				num = 400;
			}

			scheduledTransaction.setRepeatValue([num]);
		}
	}
}
