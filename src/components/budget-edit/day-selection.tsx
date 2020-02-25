import Checkbox from 'material-ui/Checkbox';
import {GridList, GridTile} from 'material-ui/GridList';
import DoneIcon from 'material-ui/svg-icons/action/done';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import Budget, {RepeatDays} from '../../stores/budget';

type MouseEvent = React.MouseEvent<{}>;
const { Component } = React;

type Props = {
	budget: Budget;
};

const DaysOfWeek = moment.weekdaysMin();

@observer
export default
class DaySelection extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const selectedDays = this.props.budget.repeatValues;

		return (
			<div>
				<GridList
					cols={7}
					cellHeight={60}
					padding={0}
				>
					{DaysOfWeek.map((day) => (
						<GridTile
							key={day}
							style={{border: '1px solid black', position: 'relative'}}
						>
							<div style={{fontSize: 32, textAlign: 'center'}}>{day}</div>
							<Checkbox
								checkedIcon={<DoneIcon/>}
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
								uncheckedIcon={<span/>}
								value={RepeatDays[day as any]}
								onCheck={(e, v) => this.handleValueChange(e, v)}
								checked={selectedDays.indexOf(RepeatDays[day as any] as any) !== -1}
							/>
						</GridTile>
					))}
				</GridList>
			</div>
		);
	}

	public handleValueChange(e: MouseEvent, checked: boolean) {
		if(checked) {
			this.props.budget.addRepeatValue(+(e.target as any).value);
		} else {
			this.props.budget.removeRepeatValue(+(e.target as any).value);
		}
	}
}
