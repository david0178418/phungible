import Checkbox from 'material-ui/Checkbox';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import DatePicker from 'material-ui/DatePicker';
import Account from '../../stores/account';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import Transaction from '../../stores/transaction';
import TrendsStore from '../../stores/trends';
import TrendsChart from './trends-chart';

type Props = {
	accounts: Account[];
	transactions: Transaction[];
	scheduledTransactions: ScheduledTransaction[];
};

@observer
export default
class Trends extends Component<Props, {}> {
	private animateChart = true;
	private store: TrendsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TrendsStore(props);
	}

	public render() {
		const store = this.store;
		return (
			<div className="content">
				<div>
					<DatePicker
						autoOk
						floatingLabelText="From"
						minDate={store.minDate}
						firstDayOfWeek={0}
						onChange={(ev, value) => this.handleUpdateFromDate(value)}
						style={{display: 'inline-block'}}
						value={store.fromDate}
					/>
					{' '}
					<DatePicker
						autoOk
						floatingLabelText="To"
						firstDayOfWeek={0}
						onChange={(ev, value) => this.handleUpdateToDate(value)}
						style={{display: 'inline-block'}}
						value={store.toDate}
					/>
				</div>
				<div>
					{store.trendOptions.map((trend) => (
						<Checkbox
							checked={store.trendIsSelected(trend)}
							key={trend}
							label={trend}
							onCheck={(ev, val) => this.handleSetTrendOption(trend, val)}
						/>
					))}
				</div>
				<TrendsChart
					animate={this.animateChart}
					data={store.selectedTrendData}
					onAnimationEnd={() => this.handleAnimationEnd()}
					trendNames={store.selectedTrendOptions}
					allTrendNames={store.trendOptions}
				/>
			</div>
		);
	}

	@action private handleUpdateFromDate(newDate: Date) {
		this.store.fromDate = newDate;
	}

	@action private handleSetTrendOption(trend: string, val: boolean) {
		if(val) {
			this.store.selectTrend(trend);
		} else {
			this.store.removeSelectedTrend(trend);
		}
	}

	@action private handleUpdateToDate(newDate: Date) {
		this.store.toDate = newDate;
	}

	private handleAnimationEnd() {
		this.animateChart = false;
	}
}
