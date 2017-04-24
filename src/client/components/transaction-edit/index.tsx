import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import {Component, FormEvent} from 'react';
import * as React from 'react';

import Account from '../../stores/account';
import Transaction, {TransactionType} from '../../stores/transaction';
import AccountSelector from '../account-selector';
import MoneyEdit from '../shared/money-edit';

type Props = {
	accounts: Account[];
	transaction: Transaction;
	onSubmit(): void;
};

@observer
export default
class TransactionForm extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}
	public render() {
		const {accounts, transaction, onSubmit} = this.props;
		const selectedTowardAccountId = transaction.towardAccount && transaction.towardAccount.id || null;
		const selectedFromAccountId = transaction.fromAccount && transaction.fromAccount.id || null;
		return (
			<form className="edit-transaction content" onSubmit={(ev: any) => this.handleSubmit(ev, onSubmit)}>
				<div>
					<TextField
						fullWidth
						floatingLabelText="Transaction Name"
						onChange={((ev: any, value: any) => this.handleUpdateName(value, transaction)) as any}
						value={transaction.name}
					/>
				</div>
				<div>
					<MoneyEdit money={transaction.amount} />
				</div>
				<div>
					<SelectField
						fullWidth
						floatingLabelText="Type"
						value={transaction.type}
						onChange={(ev, index, value) => this.handleUpdateType(value, transaction)}
					>
						<MenuItem value={TransactionType.Expense} primaryText="Expense" />
						<MenuItem value={TransactionType.Income} primaryText="Income" />
					</SelectField>
				</div>
				{!!accounts.length && (
					<div>
						<AccountSelector
							accounts={accounts}
							label="From Account"
							onChange={(value, index) => this.handleUpdateFromAccount(value, transaction)}
							selectedAccountId={selectedFromAccountId}
						/>
						<AccountSelector
							accounts={accounts}
							label="Towards Account"
							onChange={(value, index) => this.handleUpdateTowardAccount(value, transaction)}
							selectedAccountId={selectedTowardAccountId}
						/>
					</div>
				)}
				<div>
					<DatePicker
						autoOk
						fullWidth
						floatingLabelText="Date"
						hintText="Portrait Dialog"
						locale="en-US"
						onChange={(ev, date) => this.handleUpdateDate(date, transaction)}
						value={transaction.date}
					/>
				</div>
				<div>
					<TextField
						fullWidth
						floatingLabelText="Notes"
						value={transaction.notes}
						onChange={((ev: any, value: any) => this.handleUpdateNotes(value, transaction)) as any}
					/>
				</div>
			</form>
		);
	}

	@action private handleSubmit(e: FormEvent<HTMLFormElement>, onSubmit: () => void) {
		e.preventDefault();
		onSubmit();
	}
	@action private handleUpdateFromAccount(accountId: number, transaction: Transaction) {
		transaction.fromAccount = this.findAccount(accountId);
	}
	@action private handleUpdateTowardAccount(accountId: number, transaction: Transaction) {
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
		transaction.type = newType;
	}
	private findAccount = (id: number) => {
		return this.props.accounts.find((account) => account.id === id) || null;
	}
}
