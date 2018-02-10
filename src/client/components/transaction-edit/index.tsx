import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

import { TransactionType } from '../../constants';
import { FromTowardAccountSelector, TypeSelect} from '../../shared/shared-components';
import formatDate from '../../shared/utils/format-date';
import Account from '../../stores/account';
import Budget from '../../stores/budget';
import Transaction from '../../stores/transaction';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';

const {Component} = React;
type FormEvent = React.FormEvent<HTMLFormElement>;

type Props = {
	accounts: Account[];
	budgets: Budget[];
	hideDate?: boolean;
	hideNotes?: boolean;
	hideTowardsAccount?: boolean;
	hideType?: boolean;
	transaction: Transaction;
	onSubmit(): void;
};

@observer
export default
class TransactionEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}
	public render() {
		const {
			accounts,
			budgets,
			hideDate,
			hideNotes,
			hideTowardsAccount,
			hideType,
			transaction,
			onSubmit,
		} = this.props;
		const budgetId = transaction.generatedFromBudget && transaction.generatedFromBudget.id;
		return (
			<form className="edit-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div
					style={{
						display: 'flex',
					}}
				>
					<TextField
						errorText={transaction.name ? '' : 'Required'}
						floatingLabelText="Name"
						onChange={((ev: any, value: any) => this.handleUpdateName(value, transaction)) as any}
						value={transaction.name}
					/>
					<MoneyEdit
						style={{
							marginLeft: 10,
						}}
						money={transaction.amount}
					/>
				</div>
				{!hideType && (
					<div>
						<TypeSelect
							onChange={(ev, index, value) => this.handleUpdateType(value, transaction)}
							value={transaction.transactionType}
						/>
					</div>
				)}
				{!!(budgets && budgets.length) && (
					<AccountSelector
						accounts={budgets}
						label="From Budget"
						onChange={(value, index) => this.handleUpdateFromBudget(value, transaction)}
						selectedAccountId={budgetId}
					/>
				)}
				<FromTowardAccountSelector
					hideTowardsAccount={hideTowardsAccount}
					accounts={accounts}
					model={transaction}
					onFromChange={(value) => this.handleUpdateFromAccount(value, transaction)}
					onTowardChange={(value) => this.handleUpdateTowardAccount(value, transaction)}
				/>
				{!hideDate && (
					<div>
						<DatePicker
							autoOk
							fullWidth
							floatingLabelText="Date"
							hintText="Portrait Dialog"
							formatDate={(d) => formatDate(d)}
							firstDayOfWeek={0}
							onChange={(ev, date) => this.handleUpdateDate(date, transaction)}
							value={transaction.date}
						/>
					</div>
				)}
				{!hideNotes && (
					<div>
						<TextField
							fullWidth
							floatingLabelText="Notes"
							value={transaction.notes}
							onChange={((ev: any, value: any) => this.handleUpdateNotes(value, transaction)) as any}
						/>
					</div>
				)}
			</form>
		);
	}

	// TODO refactor all this
	@action private handleSubmit(e: FormEvent, onSubmit: () => void) {
		e.preventDefault();
		onSubmit();
	}
	@action private handleUpdateFromAccount(accountId: string, transaction: Transaction) {
		transaction.fromAccount = this.findAccount(accountId);
	}
	@action private handleUpdateFromBudget(budgetId: string, transaction: Transaction) {
		transaction.generatedFromBudget = this.findBudget(budgetId);
	}
	@action private handleUpdateTowardAccount(accountId: string, transaction: Transaction) {
		transaction.towardAccount = this.findAccount(accountId);
	}
	@action private handleUpdateNotes(newNote: string, transaction: Transaction) {
		transaction.notes = newNote;
	}
	@action private handleUpdateName(newName: string, transaction: Transaction) {
		transaction.name = newName;
	}
	@action private handleUpdateDate(newDate: Date, transaction: Transaction) {
		transaction.date = newDate;
	}
	@action private handleUpdateType(newType: TransactionType, transaction: Transaction) {
		transaction.transactionType = newType;
	}
	private findAccount(id: string) {
		return this.props.accounts.find((account) => account.id === id) || null;
	}
	private findBudget(id: string) {
		return this.props.budgets.find((budgets) => budgets.id === id) || null;
	}
}
