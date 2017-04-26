import DatePicker from 'material-ui/DatePicker';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import {pageStyling} from '../../shared/styles';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import TransactionEdit from '../transaction-edit';
import ActivityItem from './activity-item';

type Props = {
	store?: AppStore;
	onAdd: (transaction: Transaction) => void;
	onRemove: (transaction: Transaction) => void;
};

type State = {
	quickTransaction: Transaction;
	date: Date;
};

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
			onAdd,
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
					firstDayOfWeek={0}
					onChange={(ev, newDate) => this.handleUpdateDate(newDate)}
					value={date}
				/>
				<style>{`
					.quick-transaction-enter,
					.quick-transaction-leave {
						overflow: hidden;
						transition: max-height 500ms;
					}
					.quick-transaction-enter {
						max-height: 0;
					}
					.quick-transaction-enter-active {
						max-height: 1000px;
					}
					.quick-transaction-leave {
						max-height: 1000px;
					}
					.quick-transaction-leave-active {
						max-height: 0;
					}
				`}</style>
				<CSSTransitionGroup
					component="div"
					transitionName="quick-transaction"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
					{quickTransaction && (
						<TransactionEdit
							hideDate
							hideNotes
							hideTowardsAccount
							hideType
							accounts={this.props.store.accounts}
							transaction={quickTransaction}
							onSubmit={() => onAdd(quickTransaction)}
						/>
					)}
				</CSSTransitionGroup>
				{quickTransaction && (
					<div>
						<RaisedButton
							label="Save Quick Expense"
							primary
							style={{
								marginBottom: 10,
								width: '100%',
							}}
							disabled={!quickTransaction.isValid}
							onTouchTap={() => this.handleSaveQuickTransaction()}
						/>
						<RaisedButton
							label="Cancel Quick Expense"
							style={{
								width: '100%',
							}}
							onTouchTap={() => this.handleToggleQuickTransaction()}
						/>
					</div>
				)}
				{!quickTransaction && (
					<RaisedButton
						label="Add Quick Expense"
						primary
						style={{
							width: '100%',
						}}
						onTouchTap={() => this.handleToggleQuickTransaction()}
					/>
				)}
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
