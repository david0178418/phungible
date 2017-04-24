import DatePicker from 'material-ui/DatePicker';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ActionTrendingDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ActionTrendingUp from 'material-ui/svg-icons/navigation/arrow-upward';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import Colors from '../../shared/colors';
import {pageStyling} from '../../shared/styles';
import AppStore from '../../stores/app';
import {TransactionType} from '../../stores/transaction';
import Transaction from '../../stores/transaction';
import EditRemoveMenu from '../shared/edit-remove-menu';

type Props = {
	store?: AppStore;
	onRemove: (transaction: Transaction) => void;
};

type State = {
	date: Date,
};

type ActivityItemProps = {
	transaction: Transaction;
	onRemove: (transaction: Transaction) => void;
};

function ActivityItem({transaction, onRemove}: ActivityItemProps) {
	let rightIconButton;
	let secondaryText = transaction.name;

	if(transaction.id) {
		rightIconButton = EditRemoveMenu<Transaction>('transaction', transaction, onRemove);
	} else {
		secondaryText += ' (pending)';
	}

	return (
		<ListItem
			primaryText={`${transaction.amount.valFormatted}`}
			secondaryText={secondaryText}
			rightIconButton={rightIconButton}
			leftIcon={
				transaction.type === TransactionType.Income ?
					<ActionTrendingUp color={Colors.Money} /> :
					<ActionTrendingDown color={Colors.Debt} />
			}
		/>
	);
}

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
					{!!transactions.length && transactions.map((transaction) => {
						const id = transaction.id ? transaction.id.toString() : transaction.name;
						return (
							<ActivityItem
								key={id}
								transaction={transaction}
								onRemove={onRemove}
							/>
						);
					})}
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
