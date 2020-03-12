import React from 'react';
import {
	Transaction,
	Collection,
} from '../interfaces';
import { CollectionPage } from '../components/collection-page';
import { TransactionItem } from '../components/transaction-item';

export
function TransactionsPage() {
	return (
		<CollectionPage
			collectionType={Collection.Transactions}
			label="Transactions"
			editPath="/transaction"
			itemRenderFn={(doc: Transaction) => (
				<TransactionItem transaction={doc}/>
			)}
		/>
	);
}

export default TransactionsPage;
