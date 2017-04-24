import DatePicker from 'material-ui/DatePicker';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import {pageStyling} from '../../shared/styles';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import ActivityItem from './activity-item';

type Props = {
	store?: AppStore;
	onRemove: (transaction: Transaction) => void;
};

type State = {
	date: Date,
};

export default
class DailyActivity extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			date: moment().toDate(),
		};
	}
	public render() {
		const {
			date,
		} = this.state;
		const {
			onRemove,
		} = this.props;
		const transactions = this.props.store.findTransactionsOnDate(date);

		return (
			<div style={pageStyling}>
				<DatePicker
					autoOk
					fullWidth
					floatingLabelText="Date"
					hintText="Activity Date"
					locale="en-US"
					onChange={(ev, newDate) => this.handleUpdateDate(newDate)}
					value={date}
				/>
				<List>
					<Subheader>
						Transactions for {moment(date).format('MMMM Do YYYY')}
					</Subheader>
					{!!transactions.length && transactions.map((transaction) => (
						<ActivityItem
							key={transaction.id ? transaction.id.toString() : transaction.name}
							transaction={transaction}
							onRemove={onRemove}
						/>
					))}
					{!transactions.length && <ListItem primaryText="No Activity" />}
				</List>
			</div>
		);
	}

	public handleUpdateDate(date: Date) {
		this.setState({
			date,
		});
	}
}
