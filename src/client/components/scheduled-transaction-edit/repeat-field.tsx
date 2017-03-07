import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransaction, {RepeatUnits} from '../../shared/stores/scheduled-transaction';

type Props = {
	scheduledTransaction: ScheduledTransaction;
};

@observer
export default
class RepeatField extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {scheduledTransaction} = this.props;

		return (
			<div>
				<div style={{display: 'flex'}}>
					<TextField
						floatingLabelText="Every"
						style={{width: 30}}
						type="number"
						value={scheduledTransaction.repeatValue}
						onChange={((ev: any, value: any) => this.handleUpdateRepeatValue(value, scheduledTransaction)) as any}
						onFocus={(e) => (e.target as any).select()}
					/>
					<SelectField
						value={scheduledTransaction.repeatUnit}
						onChange={(ev, index, value) => this.handleUpdateRepeatUnit(value, scheduledTransaction)}
						floatingLabelText=" "
						style={{width: 'calc(100% - 30px)'}}
					>
						<MenuItem value={RepeatUnits.Day} primaryText="Day"/>
						<MenuItem value={RepeatUnits.Week} primaryText="Week"/>
						<MenuItem value={RepeatUnits.Month} primaryText="Month"/>
						<MenuItem value={RepeatUnits.Year} primaryText="Year"/>
					</SelectField>
				</div>
			</div>
		);
	}

	@action private handleUpdateRepeatUnit(newRepeatUnit: RepeatUnits, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.repeatUnit = newRepeatUnit;
	}
	@action private handleUpdateRepeatValue(newRepeatValue: number, scheduledTransaction: ScheduledTransaction) {
		if(newRepeatValue > 0) {
			scheduledTransaction.repeatValue = newRepeatValue | 0;
		}
	}
}
