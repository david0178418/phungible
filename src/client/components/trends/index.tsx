import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import DatePicker from 'material-ui/DatePicker';
import formatDate from '../../shared/utils/format-date';
import Account from '../../stores/account';
import Budget from '../../stores/budget';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import Transaction from '../../stores/transaction';
import TrendsStore from '../../stores/trends';

const {Component} = React;

interface Props {
	accounts: Account[];
	budgets: Budget[];
	transactions: Transaction[];
	scheduledTransactions: ScheduledTransaction[];
}

@observer
export default
class Trends extends Component<Props, {}> {
	private animateChart = true;
	private store: TrendsStore;

	@observable private TrendsChartComponent: any = null;

	constructor(props: Props) {
		super(props);
		this.store = new TrendsStore(props);
		import('./trends-chart')
			.then((m: any) => {
				setTimeout(action(() => {
					this.TrendsChartComponent = m.default;
				}), 500);
			});
	}

	public render() {
		const store = this.store;
		return (
			<div className="content">
				<div>
					<DatePicker
						autoOk
						floatingLabelText="From"
						formatDate={(d) => formatDate(d)}
						minDate={store.minFromDate}
						firstDayOfWeek={0}
						onChange={(ev, value) => this.handleUpdateFromDate(value)}
						style={{
							display: 'inline-block',
						}}
						textFieldStyle={{
							width: 150,
						}}
						value={store.fromDate}
					/>
					{' '}
					<DatePicker
						autoOk
						floatingLabelText="To"
						firstDayOfWeek={0}
						formatDate={(d) => formatDate(d)}
						minDate={store.minToDate}
						onChange={(ev, value) => this.handleUpdateToDate(value)}
						style={{
							display: 'inline-block',
						}}
						textFieldStyle={{
							width: 150,
						}}
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
				{this.TrendsChartComponent && (
					<this.TrendsChartComponent
						animate={this.animateChart}
						data={store.selectedTrendData}
						onAnimationEnd={() => this.handleAnimationEnd()}
						trendNames={store.selectedTrendOptions}
						allTrendNames={store.trendOptions}
					/>
				)}

				{!this.TrendsChartComponent && (
					<CircularProgress
						style={{
							marginTop: 51,
							textAlign: 'center',
							width: '100%',
						}}
					/>
				)}
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
