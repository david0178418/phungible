import { TransactionType } from '../../constants';
import { AccountActionModel } from '../../types';

export
function fromAccountErrText({transactionType, fromAccount}: AccountActionModel) {
	if(!fromAccount) {
		if(transactionType === TransactionType.Expense) {
			return 'Expenses require an account to draw from';
		} else if(transactionType === TransactionType.TransferPayment) {
			return 'Transfers/Payments require an account to draw from';
		}
	}
}

export
function towardAccountErrText({transactionType, towardAccount}: AccountActionModel) {
	if(!towardAccount) {
		if(transactionType === TransactionType.Income) {
			return 'Incomes require an account to deposit into';
		} else if(transactionType === TransactionType.TransferPayment) {
			return 'Transfers/Payments require an account to deposit into';
		}
	}
}
