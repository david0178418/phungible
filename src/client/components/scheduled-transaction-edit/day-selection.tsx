import Checkbox from 'material-ui/Checkbox';
import {GridList, GridTile} from 'material-ui/GridList';
import DoneIcon from 'material-ui/svg-icons/action/done';
import * as moment from 'moment';
import {Component} from 'react';
import * as React from 'react';

type Props = {
};

const DaysOfWeek = moment.weekdaysMin();

export default
class DaySelection extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
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
								value={day}
							/>
						</GridTile>
					))}
				</GridList>
				<small><em>Note: If the selected date doesn't exist in a given month, the last day will be used.</em></small>
			</div>
		);
	}
}
