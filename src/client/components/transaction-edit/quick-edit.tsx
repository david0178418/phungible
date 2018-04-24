import RaisedButton from 'material-ui/RaisedButton';
import {observer} from 'mobx-react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Account from '../../stores/account';
import Budget from '../../stores/budget';
import Transaction from '../../stores/transaction';
import TransactionEdit from '../transaction-edit';

const {Component} = React;

interface Props {
	accounts: Account[];
	budgets?: Budget[];
	date: Date;
	openButtonText: string;
	transaction: Transaction;
	onAdd(): void;
	onToggleOpen(): void;
}

@observer
export default
class QuickEdit extends Component<Props> {
	constructor(props: Props) {
		super(props);

	}
	public render() {
		const {
			accounts,
			budgets,
			onAdd,
			onToggleOpen,
			openButtonText,
			transaction,
		} = this.props;

		return (
			<div>
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
					{transaction && (
						<TransactionEdit
							hideDate
							hideTowardsAccount
							hideType
							accounts={accounts}
							budgets={budgets}
							transaction={transaction}
							onSubmit={onAdd}
						/>
					)}
				</CSSTransitionGroup>
				{transaction && (
					<div>
						<RaisedButton
							label="Save Expense"
							primary
							style={{
								marginBottom: 10,
								width: '100%',
							}}
							disabled={!transaction.isValid}
							onClick={onAdd}
						/>
						<RaisedButton
							label="Cancel Expense"
							style={{
								width: '100%',
							}}
							onClick={onToggleOpen}
						/>
					</div>
				)}
				{!transaction && (
					<RaisedButton
						disabled={!accounts.length}
						label={openButtonText}
						primary
						style={{
							width: '100%',
						}}
						onClick={onToggleOpen}
					/>
				)}
			</div>
		);
	}
}
