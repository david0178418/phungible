import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component, FormEvent} from 'react';
import * as React from 'react';

import Account from '../../stores/account';
import ScheduledTransaction, {RepeatUnits, ScheduledTransactionFacade} from '../../stores/scheduled-transaction';
import {TransactionType} from '../../stores/transaction';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';
import NameAmountPartial from './name-amount-partial';
import RepeatField from './repeat-field';

type Props = {
	accounts: Account[];
	isBudget?: boolean;
	scheduledTransaction: ScheduledTransaction | ScheduledTransactionFacade;
	onSubmit(): void;
};

@observer
export default
class ScheduledTransactionEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {
			accounts,
			isBudget,
			scheduledTransaction,
			onSubmit,
		} = this.props;
		const isFacade = scheduledTransaction instanceof ScheduledTransactionFacade;
		const selectedTowardAccountId = scheduledTransaction.towardAccount && scheduledTransaction.towardAccount.id || null;
		const selectedFromAccountId = scheduledTransaction.fromAccount && scheduledTransaction.fromAccount.id || null;

		// TODO Simplify this to always use the facade
		return (
			<form className="create-scheduled-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					{isFacade && <NameAmountPartial
						transactionPartials={(scheduledTransaction as ScheduledTransactionFacade).transactionPartials}
						onAddEntry={() => (scheduledTransaction as ScheduledTransactionFacade).addPartial()}
						onRemoveEntry={(id) => (scheduledTransaction as ScheduledTransactionFacade).removePartial(id)}
						onUpdateName={(name, transaction) => this.handleUpdateName(name, transaction)}
					/> || (
						<div style={{
							display: 'flex',
						}}>
							<TextField
								errorText={scheduledTransaction.name ? '' : 'Name is required'}
								floatingLabelText="Name"
								textareaStyle={{
									width: 200,
								}}
								value={scheduledTransaction.name}
								onChange={((ev: any, value: any) => this.handleUpdateName(value, scheduledTransaction)) as any}
							/>
							{' '}
							<MoneyEdit
								money={scheduledTransaction.amount}
							/>
						</div>
					)}
				</div>
				{!isBudget && (
					<div>
						<SelectField
							fullWidth
							floatingLabelText="Type"
							value={scheduledTransaction.type}
							onChange={(ev, index, value) => this.handleUpdateType(value, scheduledTransaction)}
						>
							<MenuItem value={TransactionType.Income} primaryText="Income" />
							<MenuItem value={TransactionType.Expense} primaryText="Expense" />
						</SelectField>
					</div>
				)}
				<div>
					<DatePicker
						autoOk
						fullWidth
						floatingLabelText="Starts"
						hintText="Portrait Dialog"
						firstDayOfWeek={0}
						onChange={(ev, date) => this.handleUpdateStartDate(date, scheduledTransaction)}
						value={scheduledTransaction.startDate}
					/>
				</div>
				{!!accounts.length && (
					<div>
						<AccountSelector
							errorText={this.fromAccountErrText()}
							accounts={accounts}
							label="From Account"
							onChange={(value) => this.handleUpdateFromAccount(value, scheduledTransaction)}
							selectedAccountId={selectedFromAccountId}
						/>
						{!isBudget && (
							<AccountSelector
								errorText={this.towardAccountErrText()}
								accounts={accounts}
								label="Towards Account"
								onChange={(value) => this.handleUpdateTowardAccount(value, scheduledTransaction)}
								selectedAccountId={selectedTowardAccountId}
							/>
						)}
					</div>
				)}
				<div style={{display: 'inline-block'}}>
					<Checkbox
						checked={scheduledTransaction.repeats}
						label="Repeats"
						onClick={() => this.handleToggleRepeats(scheduledTransaction)}
						type="checkbox"
					/>
				</div>
				{scheduledTransaction.repeats && <RepeatField scheduledTransaction={scheduledTransaction} />}
			</form>
		);
	}

	private fromAccountErrText() {
		let errorText = '';
		const scheduledTransaction = this.props.scheduledTransaction;

		if(
			!scheduledTransaction.fromAccount &&
			scheduledTransaction.type !== TransactionType.Income
		) {
			errorText = 'Expenses require an account to draw from';
		}

		return errorText;
	}

	private towardAccountErrText() {
		let errorText = '';
		const scheduledTransaction = this.props.scheduledTransaction;

		if(
			!scheduledTransaction.towardAccount &&
			scheduledTransaction.type === TransactionType.Income
		) {
			errorText = 'Incomes require an account to deposit toward';
		}

		return errorText;
	}

	@action private handleSubmit(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
		e.preventDefault();
		onSubmit();
	}
	@action private handleToggleRepeats(scheduledTransaction: ScheduledTransaction) {
		if(scheduledTransaction.repeats) {
			scheduledTransaction.repeatUnit = RepeatUnits.None;
		} else {
			scheduledTransaction.repeatUnit = RepeatUnits.Week;
		}
	}
	@action private handleUpdateFromAccount(accountId: string, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.fromAccount = this.findAccount(accountId);
	}
	@action private handleUpdateTowardAccount(accountId: string, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.towardAccount = this.findAccount(accountId);
	}
	@action private handleUpdateName(newName: string, scheduledTransaction: {name: string}) {
		scheduledTransaction.name = newName;
	}
	@action private handleUpdateStartDate(newDate: Date, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.startDate = newDate;
	}
	@action private handleUpdateType(newType: TransactionType, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.type = newType;
	}

	private findAccount(id: string) {
		return this.props.accounts.find((account) => account.id === id) || null;
	}
}
