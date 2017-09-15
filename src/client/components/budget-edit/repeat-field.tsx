import {Tab, Tabs} from 'material-ui/Tabs';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

import Budget, {RepeatTypes} from '../../stores/budget';
import DateSelection from './date-selection';
import DaySelection from './day-selection';
import IntervalSelection from './interval-selection';

import * as moment from 'moment';
import 'moment-recur';

const { Component } = React;

// TODO Remove debug
(window as any).moment = moment;

type Props = {
	budget: Budget;
};

@observer
export default
class RepeatField extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {budget} = this.props;

		return (
			<div style={{
				minHeight: 410,
			}}>
				<Tabs
					onChange={(newType) => {
						setTimeout(() => this.handleTabChange(newType), 0);
					}}
					value={budget.repeatType}
				>
					<Tab
						label="Day"
						value={RepeatTypes.Days}
					>
						{budget.repeatType === RepeatTypes.Days &&
							<DaySelection budget={budget} />
						}
					</Tab>
					<Tab
						label="Date"
						value={RepeatTypes.Dates}
					>
						{budget.repeatType === RepeatTypes.Dates &&
							<DateSelection budget={budget} />
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
						{budget.repeatType === RepeatTypes.Interval &&
							<IntervalSelection budget={budget}  />
						}
					</Tab>
				</Tabs>
			</div>
		);
	}

	@action private handleTabChange(newType: number) {
		this.props.budget.repeatType = newType;
	}
}
