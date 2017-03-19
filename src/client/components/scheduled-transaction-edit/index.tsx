import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component, FormEvent} from 'react';
import * as React from 'react';

import Account from '../../shared/stores/account';
import ScheduledTransaction, {RepeatUnits, ScheduledTransactionFacade} from '../../shared/stores/scheduled-transaction';
import {TransactionType} from '../../shared/stores/transaction';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';
import RepeatField from './repeat-field';

type Props = {
	accounts: Account[];
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
		const {accounts, scheduledTransaction, onSubmit} = this.props;
		const isFacade = scheduledTransaction instanceof ScheduledTransactionFacade;
		const selectedTowardAccountId = scheduledTransaction.towardAccount && scheduledTransaction.towardAccount.id || null;
		const selectedFromAccountId = scheduledTransaction.fromAccount && scheduledTransaction.fromAccount.id || null;

		return (
			<form className="create-scheduled-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					{isFacade && (scheduledTransaction as ScheduledTransactionFacade).transactionFacades.map((transaction, index) => (
						<span key={index}>
							<TextField
								fullWidth
								floatingLabelText="Transaction Name"
								style={{width: 200}}
								value={transaction.name}
								onChange={((ev: any, value: any) => this.handleUpdateName(value, transaction)) as any}
							/>
							<MoneyEdit money={transaction.amount} />
						</span>
					)) || !isFacade && (
						<span>
							<TextField
								fullWidth
								floatingLabelText="Transaction Name"
								style={{width: 200}}
								value={scheduledTransaction.name}
								onChange={((ev: any, value: any) => this.handleUpdateName(value, scheduledTransaction)) as any}
							/>
							<MoneyEdit money={scheduledTransaction.amount} />
						</span>
					)}
				</div>
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
				<div>
					<DatePicker
						autoOk
						fullWidth
						floatingLabelText="Starts"
						hintText="Portrait Dialog"
						locale="en-US"
						onChange={(ev, date) => this.handleUpdateStartDate(date, scheduledTransaction)}
						value={scheduledTransaction.startDate}
					/>
				</div>
				<div>
					<TextField
						fullWidth
						floatingLabelText="Description"
						multiLine
						onChange={(ev: any) => this.handleUpdateDescription((ev.target as HTMLInputElement).value, scheduledTransaction)}
						value={scheduledTransaction.description}
					/>
				</div>
				{!!accounts.length && (
					<div>
						<AccountSelector
							accounts={accounts}
							label="From Account"
							onChange={(value) => this.handleUpdateFromAccount(value, scheduledTransaction)}
							selectedAccountId={selectedFromAccountId}
						/>
						<AccountSelector
							accounts={accounts}
							label="Towards Account"
							onChange={(value) => this.handleUpdateTowardAccount(value, scheduledTransaction)}
							selectedAccountId={selectedTowardAccountId}
						/>
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
	@action private handleUpdateFromAccount(accountId: number, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.fromAccount = this.findAccount(accountId);
	}
	@action private handleUpdateTowardAccount(accountId: number, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.towardAccount = this.findAccount(accountId);
	}
	@action private handleUpdateDescription(newDescription: string, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.description = newDescription;
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

	private findAccount(id: number) {
		return this.props.accounts.find((account) => account.id === id) || null;
	}
}
