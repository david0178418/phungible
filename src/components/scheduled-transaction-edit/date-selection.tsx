import Checkbox from 'material-ui/Checkbox';
import {GridList, GridTile} from 'material-ui/GridList';
import DoneIcon from 'material-ui/svg-icons/action/done';
import {observer} from 'mobx-react';
import * as React from 'react';

import ScheduledTransaction from '../../stores/scheduled-transaction';

const {Component} = React;
type MouseEvent = React.MouseEvent<{}>;

type Props = {
	scheduledTransaction: ScheduledTransaction;
};

@observer
export default
class DateSelection extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const dates: JSX.Element[] = [];
		const selectedDates = this.props.scheduledTransaction.repeatValues;

		for(let date = 1; date <= 31; date++) {
			dates.push(
				<GridTile
					key={date}
					style={{
						backgroundColor: 'white',
						position: 'relative',
					}}
				>
					<div style={{fontSize: 32, textAlign: 'center'}}>{date}</div>
					<Checkbox
						checkedIcon={<DoneIcon/>}
						iconStyle={{
							bottom: 0,
							position: 'absolute',
							right: -5,
						}}
						style={{
							height: '100%',
							left: 0,
							position: 'absolute',
							top: 0,
							width: '100%',
						}}
						uncheckedIcon={<span/>}
						value={date}
						onCheck={(e, v) => this.handleValueChange(e, v)}
						checked={selectedDates.indexOf(date) !== -1}
					/>
				</GridTile>,
			);
		}

		return (
			<div>
				<GridList
					cellHeight={60}
					cols={7}
					padding={1}
					style={{
						backgroundColor: 'black',
					}}
				>
					{dates}
				</GridList>
				<small><em>Note: If the selected date doesn't exist in a given month, the last day will be used.</em></small>
			</div>
		);
	}

	public handleValueChange(e: MouseEvent, checked: boolean) {
		if(checked) {
			this.props.scheduledTransaction.addRepeatValue(+(e.target as any).value);
		} else {
			this.props.scheduledTransaction.removeRepeatValue(+(e.target as any).value);
		}
	}
}
