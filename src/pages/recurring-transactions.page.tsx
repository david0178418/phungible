import React from 'react';
import {
	Collection,
	RecurringTransaction,
} from '@shared/interfaces';
import { RecurringTransactionItem } from '@components/recurring-transaction-item';
import { CollectionPage } from '@components/collection-page';

export
function RecurringTransactionsPage() {
	return (
		<CollectionPage
			collectionType={Collection.RecurringTransactions}
			label="Recurring Transactions"
			editPath="/recurring-transaction"
			itemRenderFn={(rt: RecurringTransaction) => (
				<RecurringTransactionItem
					recurringTransaction={rt}
				/>
			)}
		/>
	);
}

export default RecurringTransactionsPage;
