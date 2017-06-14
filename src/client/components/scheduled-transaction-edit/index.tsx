import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component, FormEvent} from 'react';
import * as React from 'react';

import {ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import formatDate from '../../shared/utils/format-date';
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
	model: ScheduledTransaction | ScheduledTransactionFacade;
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
			model,
			onSubmit,
		} = this.props;
		const isFacade = model instanceof ScheduledTransactionFacade;
		const selectedTowardAccountId = model.towardAccount && model.towardAccount.id || null;
		const selectedFromAccountId = model.fromAccount && model.fromAccount.id || null;

		// TODO Simplify this to always use the facade
		return (
			<form className="create-scheduled-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					{isFacade && <NameAmountPartial
						transactionPartials={(model as ScheduledTransactionFacade).transactionPartials}
						onAddEntry={() => (model as ScheduledTransactionFacade).addPartial()}
						onRemoveEntry={(id) => (model as ScheduledTransactionFacade).removePartial(id)}
						onUpdateName={(name, transaction) => this.handleUpdateName(name, transaction)}
					/> || (
						<div style={{
							display: 'flex',
						}}>
							<TextField
								errorText={model.name ? '' : 'Name is required'}
								floatingLabelText="Name"
								value={model.name}
								onChange={((ev: any, value: any) => this.handleUpdateName(value, model)) as any}
							/>
							{' '}
							<MoneyEdit
								style={{
									marginLeft: 10,
								}}
								money={model.amount}
							/>
						</div>
					)}
				</div>
				{!isBudget && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<div
							style={{
								position: 'relative',
								width: 40,
							}}
						>
							{model.type === TransactionType.Income ?
								<IncomeIcon
									style={{
										bottom: 13,
										position: 'absolute',
									}}
								/> :
								<ExpenseIcon
									style={{
										bottom: 13,
										position: 'absolute',
									}}
								/>
							}
						</div>
						<SelectField
							fullWidth
							floatingLabelText="Type"
							value={model.type}
							onChange={(ev, index, value) => this.handleUpdateType(value, model)}
						>
							<MenuItem
								leftIcon={<IncomeIcon/>}
								primaryText="Income"
								value={TransactionType.Income}
							/>
							<MenuItem
								leftIcon={<ExpenseIcon/>}
								primaryText="Expense"
								value={TransactionType.Expense}
							/>
						</SelectField>
					</div>
				)}
				<div>
					<DatePicker
						autoOk
						fullWidth
						floatingLabelText="Starts"
						hintText="Portrait Dialog"
						formatDate={(d) => formatDate(d)}
						firstDayOfWeek={0}
						onChange={(ev, date) => this.handleUpdateStartDate(date, model)}
						value={model.startDate}
					/>
				</div>
				{!!accounts.length && (
					<div>
						<AccountSelector
							errorText={this.fromAccountErrText()}
							accounts={accounts}
							label="From Account"
							onChange={(value) => this.handleUpdateFromAccount(value, model)}
							selectedAccountId={selectedFromAccountId}
						/>
						{!isBudget && (
							<AccountSelector
								errorText={this.towardAccountErrText()}
								accounts={accounts}
								label="Towards Account"
								onChange={(value) => this.handleUpdateTowardAccount(value, model)}
								selectedAccountId={selectedTowardAccountId}
							/>
						)}
					</div>
				)}
				<div style={{display: 'inline-block'}}>
					<Checkbox
						checked={model.repeats}
						label="Repeats"
						onClick={() => this.handleToggleRepeats(model)}
						type="checkbox"
					/>
				</div>
				{model.repeats && (
					<div>
						Next Occurance: {model.repeatValues.length ?
							formatDate(model.nextOccurance) :
							'N/A'
						}
						<RepeatField scheduledTransaction={model} />
					</div>
				)}
			</form>
		);
	}

	private fromAccountErrText() {
		let errorText = '';
		const scheduledTransaction = this.props.model;

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
		const scheduledTransaction = this.props.model;

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
		scheduledTransaction.repeatUnit = scheduledTransaction.repeats ? RepeatUnits.None : RepeatUnits.Week;
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
		// tslint:disable-next-line:triple-equals
		return this.props.accounts.find((account) => account.id == id) || null;
	}
}
