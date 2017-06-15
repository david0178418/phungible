import {Tab, Tabs} from 'material-ui/Tabs';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransaction, {RepeatTypes} from '../../stores/scheduled-transaction';
import DateSelection from './date-selection';
import DaySelection from './day-selection';
import IntervalSelection from './interval-selection';

import * as moment from 'moment';
import 'moment-recur';

// TODO Remove debug
(window as any).moment = moment;

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
			<div style={{
				minHeight: 410,
			}}>
				<Tabs
					onChange={(newType) => {
						setTimeout(() => this.handleTabChange(newType), 0);
					}}
					value={scheduledTransaction.repeatType}
				>
					<Tab
						label="Day"
						value={RepeatTypes.Days}
					>
						{scheduledTransaction.repeatType === RepeatTypes.Days &&
							<DaySelection scheduledTransaction={scheduledTransaction} />
						}
					</Tab>
					<Tab
						label="Date"
						value={RepeatTypes.Dates}
					>
						{scheduledTransaction.repeatType === RepeatTypes.Dates &&
							<DateSelection scheduledTransaction={scheduledTransaction} />
						}
					</Tab>
					<Tab
						label="Interval"
						value={RepeatTypes.Interval}
					>
						{/*
							Delayed rendering since repeateValue needs to be
							populated with exactly 1 number for the input.
						*/}
						{scheduledTransaction.repeatType === RepeatTypes.Interval &&
							<IntervalSelection scheduledTransaction={scheduledTransaction}  />
						}
					</Tab>
				</Tabs>
			</div>
		);
	}

	@action private handleTabChange(newType: number) {
		this.props.scheduledTransaction.repeatType = newType;
	}
}
