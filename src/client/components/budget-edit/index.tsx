import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';

import {TransactionType} from '../../constants';
import {ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import formatDate from '../../shared/utils/format-date';
import Account from '../../stores/account';
import Budget, {BudgetFacade, RepeatUnits} from '../../stores/budget';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';
import NameAmountPartial from './name-amount-partial';
import RepeatField from './repeat-field';

type FormEvent = React.FormEvent<HTMLFormElement>;
const { Component } = React;

type Props = {
	accounts: Account[];
	isBudget?: boolean;
	model: Budget | BudgetFacade;
	onSubmit(): void;
};

@observer
export default
class BudgetEdit extends Component<Props, any> {
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
		const isFacade = model instanceof BudgetFacade;
		const selectedTowardAccountId = model.towardAccount && model.towardAccount.id || null;
		const selectedFromAccountId = model.fromAccount && model.fromAccount.id || null;

		// TODO Simplify this to always use the facade
		return (
			<form className="create-scheduled-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					{isFacade && <NameAmountPartial
						transactionPartials={(model as BudgetFacade).transactionPartials}
						onAddEntry={() => (model as BudgetFacade).addPartial()}
						onRemoveEntry={(id) => (model as BudgetFacade).removePartial(id)}
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
							{model.transactionType === TransactionType.Income ?
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
							value={model.transactionType}
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
						<RepeatField budget={model} />
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
			scheduledTransaction.transactionType !== TransactionType.Income
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
			scheduledTransaction.transactionType === TransactionType.Income
		) {
			errorText = 'Incomes require an account to deposit toward';
		}

		return errorText;
	}

	@action private handleSubmit(e: FormEvent, onSubmit: () => void) {
		e.preventDefault();
		onSubmit();
	}
	@action private handleToggleRepeats(scheduledTransaction: Budget) {
		scheduledTransaction.repeatUnit = scheduledTransaction.repeats ? RepeatUnits.None : RepeatUnits.Week;
	}
	@action private handleUpdateFromAccount(accountId: string, scheduledTransaction: Budget) {
		scheduledTransaction.fromAccount = this.findAccount(accountId);
	}
	@action private handleUpdateTowardAccount(accountId: string, scheduledTransaction: Budget) {
		scheduledTransaction.towardAccount = this.findAccount(accountId);
	}
	@action private handleUpdateName(newName: string, scheduledTransaction: {name: string}) {
		scheduledTransaction.name = newName;
	}
	@action private handleUpdateStartDate(newDate: Date, scheduledTransaction: Budget) {
		scheduledTransaction.startDate = newDate;
	}
	@action private handleUpdateType(newType: TransactionType, scheduledTransaction: Budget) {
		scheduledTransaction.transactionType = newType;
	}

	private findAccount(id: string) {
		// tslint:disable-next-line:triple-equals
		return this.props.accounts.find((account) => account.id == id) || null;
	}
}
