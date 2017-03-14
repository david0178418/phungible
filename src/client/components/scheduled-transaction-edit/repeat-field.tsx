import Checkbox from 'material-ui/Checkbox';
import {GridList, GridTile} from 'material-ui/GridList';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import DoneIcon from 'material-ui/svg-icons/action/done';
import AddIcon from 'material-ui/svg-icons/content/add';
import {Tab, Tabs} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransaction, {RepeatUnits} from '../../shared/stores/scheduled-transaction';

import * as moment from 'moment';
import 'moment-recur';

(window as any).moment = moment;

type Props = {
	scheduledTransaction: ScheduledTransaction;
};

function RenderDates() {
	const dates: JSX.Element[] = [];

	for(let x = 1; x <= 31; x++) {
		dates.push(
			<GridTile
				key={x}
				style={{border: '1px solid black', position: 'relative'}}
			>
				<span style={{fontSize: 32}}>{x}</span>
				<Checkbox
					checkedIcon={<DoneIcon/>}
					uncheckedIcon={<span/>}
					iconStyle={{
						bottom: 0,
						position: 'absolute',
						right: 0,
					}}
					style={{
						height: '100%',
						left: 0,
						position: 'absolute',
						top: 0,
						width: '100%',
					}}
				/>
			</GridTile>,
		);
	}

	return (
		<div>
			<GridList
				cols={7}
				cellHeight={60}
				padding={0}
			>
				{dates}
			</GridList>
			<small><em>Note: If the selected date doesn't exist in a given month, the last day will be used.</em></small>
		</div>
	);
}

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
				<Tabs>
					<Tab label="Interval">
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
					</Tab>
					<Tab label="Date">
						<RenderDates />
					</Tab>
					<Tab label="Day">
						
					</Tab>
				</Tabs>
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
