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
import ScheduledTransaction, {RepeatUnits} from '../../shared/stores/scheduled-transaction';
import {TransactionType} from '../../shared/stores/transaction';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';

type Props = {
	accounts: Account[];
	scheduledTransaction: ScheduledTransaction;
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
		return (
			<form className="create-scheduled-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					<TextField
						fullWidth
						floatingLabelText="Transaction Name"
						value={scheduledTransaction.name}
						onChange={((ev: any, value: any) => this.handleUpdateName(value, scheduledTransaction)) as any}
					/>
				</div>
				<div>
					<MoneyEdit money={scheduledTransaction.amount} />
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
							selectedAccount={scheduledTransaction.fromAccount || null}
						/>
						<AccountSelector
							accounts={accounts}
							label="Towards Account"
							onChange={(value) => this.handleUpdateTowardAccount(value, scheduledTransaction)}
							selectedAccount={scheduledTransaction.towardAccount || null}
						/>
					</div>
				)}
				<div>
					<Checkbox
						checked={!scheduledTransaction.repeats}
						label="One-time entry"
						onClick={() => this.handleToggleRepeats(scheduledTransaction)}
						type="checkbox"
					/>
				</div>
				{scheduledTransaction.repeats && (
					<div>
						<div style={{display: 'flex'}}>
							<TextField
								floatingLabelText="Every"
								style={{width: 30}}
								type="number"
								value={scheduledTransaction.repeatValue}
								onChange={((ev: any, value: any) => this.handleUpdateRepeatValue(value, scheduledTransaction)) as any}
								onFocus={(e) => (e.target as any).select()}
							/>
							<SelectField
								value={scheduledTransaction.repeatUnit}
								onChange={(ev, index, value) => this.handleUpdateRepeatUnit(value, scheduledTransaction)}
								floatingLabelText=" "
								style={{width: 'calc(100% - 30px)'}}
							>
								<MenuItem value={RepeatUnits.Day} primaryText="Day"/>
								<MenuItem value={RepeatUnits.Week} primaryText="Week"/>
								<MenuItem value={RepeatUnits.Month} primaryText="Month"/>
								<MenuItem value={RepeatUnits.Year} primaryText="Year"/>
							</SelectField>
						</div>
					</div>
				)}
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
	@action private handleUpdateFromAccount(account: Account, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.fromAccount = account;
	}
	@action private handleUpdateTowardAccount(account: Account, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.towardAccount = account || null;
	}
	@action private handleUpdateDescription(newDescription: string, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.description = newDescription;
	}
	@action private handleUpdateRepeatUnit(newRepeatUnit: RepeatUnits, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.repeatUnit = newRepeatUnit;
	}
	@action private handleUpdateRepeatValue(newRepeatValue: number, scheduledTransaction: ScheduledTransaction) {
		if(newRepeatValue > 0) {
			scheduledTransaction.repeatValue = newRepeatValue | 0;
		}
	}
	@action private handleUpdateName(newName: string, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.name = newName;
	}
	@action private handleUpdateStartDate(newDate: Date, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.startDate = newDate;
	}
	@action private handleUpdateType(newType: TransactionType, scheduledTransaction: ScheduledTransaction) {
		scheduledTransaction.type = newType;
	}
}
