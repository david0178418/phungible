import { TransactionType, Transaction, Profile } from '@shared/interfaces';

export
function canSaveTransaction(transaction: Transaction) {
	const {
		amount,
		fromAccountId,
		towardAccountId,
		type,
		name,
		date,
	} = transaction;

	return !!(
		amount &&
		name &&
		date && (
			fromAccountId || (
				type === TransactionType.Income
			)
		) && (
			towardAccountId || (
				type === TransactionType.Expense
			)
		)
	);
}

export
function canSaveProfile(profile: Profile) {
	return !!(
		profile.name
	);
}
