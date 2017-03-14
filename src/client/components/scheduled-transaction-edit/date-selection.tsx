import Checkbox from 'material-ui/Checkbox';
import {GridList, GridTile} from 'material-ui/GridList';
import DoneIcon from 'material-ui/svg-icons/action/done';
import {Component} from 'react';
import * as React from 'react';

type Props = {
};

export default
class DateSelection extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const dates: JSX.Element[] = [];

		for(let date = 1; date <= 31; date++) {
			dates.push(
				<GridTile
					key={date}
					style={{border: '1px solid black', position: 'relative'}}
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
					/>
				</GridTile>,
			);
		}

		return (
			<div>
				<GridList
					cellHeight={60}
					cols={7}
					padding={0}
				>
					{dates}
				</GridList>
				<small><em>Note: If the selected date doesn't exist in a given month, the last day will be used.</em></small>
			</div>
		);
	}
}
