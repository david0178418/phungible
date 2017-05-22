import DatePicker from 'material-ui/DatePicker';
import {List, ListItem} from 'material-ui/List';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import formatDate from '../../shared/utils/format-date';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import TransactionQuickEdit from '../transaction-edit/quick-edit';
import ActivityItem from './activity-item';

interface Props {
	store: AppStore;
	onAdd: (transaction: Transaction) => void;
	onRemove: (transaction: Transaction) => void;
}

interface State {
	quickTransaction: Transaction;
	date: Date;
}

@observer
export default
class DailyActivity extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			date: moment().toDate(),
			quickTransaction: null,
		};
	}
	public render() {
		const {
			date,
			quickTransaction,
		} = this.state;
		const {
			store,
			onRemove,
		} = this.props;
		const transactions = store.findTransactionsOnDate(date);

		return (
			<div>
				<TransactionQuickEdit
					accounts={store.accounts}
					date={date}
					openButtonText="Add Quick Expense"
					transaction={quickTransaction}
					onAdd={() => this.handleSaveQuickTransaction()}
					onToggleOpen={() => this.handleToggleQuickTransaction()}
				/>
				<DatePicker
					autoOk
					fullWidth
					firstDayOfWeek={0}
					floatingLabelText={`Transactions for:`}
					formatDate={(d) => formatDate(d)}
					value={date}
					style={{
						boxSizing: 'border-box',
						padding: '0 10px',
					}}
					hintText="Activity Date"
					onChange={(ev, newDate) => this.handleUpdateDate(newDate)}
				/>
				<List>
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

	private handleToggleQuickTransaction() {
		if(this.state.quickTransaction) {
			this.setState({
				quickTransaction: null,
			});
		} else {
			this.setState({
				quickTransaction: new Transaction({
					date: this.state.date,
				}),
			});
		}
	}

	private handleSaveQuickTransaction() {
		this.props.onAdd(this.state.quickTransaction);
		this.setState({
			quickTransaction: null,
		});
	}

	private handleUpdateDate(date: Date) {
		this.setState({
			date,
		});
	}
}
