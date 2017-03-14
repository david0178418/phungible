import {Tab, Tabs} from 'material-ui/Tabs';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransaction from '../../shared/stores/scheduled-transaction';
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
			<div>
				<Tabs>
					<Tab label="Date">
						<DateSelection />
					</Tab>
					<Tab label="Day">
						<DaySelection />
					</Tab>
					<Tab label="Interval">
						<IntervalSelection scheduledTransaction={scheduledTransaction}  />
					</Tab>
				</Tabs>
			</div>
		);
	}
}
