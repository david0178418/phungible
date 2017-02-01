import Checkbox from 'material-ui/Checkbox';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import DatePicker from 'material-ui/DatePicker';
import Account from '../../shared/stores/account';
import Transaction from '../../shared/stores/transaction';
import TrendsStore from '../../shared/stores/trends';
import TrendsChart from './trends-chart';

type Props = {
	accounts: Account[];
	transactions: Transaction[];
};
type State = {
	animateChart: boolean;
};

@observer
export default
class Trends extends Component<Props, State> {
	private store: TrendsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TrendsStore(props);
		this.state = {
			animateChart: true,
		};
	}

	public render() {
		const store = this.store;
		return (
			<div>
				<div>
					<DatePicker
						autoOk
						floatingLabelText="From"
						minDate={store.minDate}
						locale="en-US"
						onChange={(ev, value) => this.handleUpdateFromDate(value)}
						style={{display: 'inline-block'}}
						value={store.fromDate}
					/>
					{' '}
					<DatePicker
						autoOk
						floatingLabelText="To"
						locale="en-US"
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
					animate={this.state.animateChart}
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
		if(this.state.animateChart) {
			this.setState({
				animateChart: false,
			});
		}
	}
}
