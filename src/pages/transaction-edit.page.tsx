import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createTransaction, saveDoc, getDoc } from '../api';
import { Collection, Transaction } from '../interfaces';
import { TransactionEditForm } from '../components/transaction-edit-form';
import { EditPage } from '../components/edit-page';
import { useTransactionEdit } from '../hooks';

export
function TransactionEditPage() {
	const [
		transaction,
		setTransaction,
		resetTransaction,
		isValid,
	] = useTransactionEdit(createTransaction);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Transaction>(`${Collection.Transactions}/${id}`);
				if(a) {
					resetTransaction({...a});
				}
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveDoc(transaction, Collection.Transactions);
		result && goBack();
	}

	return (
		<EditPage
			defaultHref="/transactions"
			canSave={isValid}
			editing={!!id}
			loading={loading}
			handleSubmit={handleSubmit}
		>
			<TransactionEditForm
				transaction={transaction}
				onUpdate={newTransaction => setTransaction(newTransaction)}
			/>
		</EditPage>
	);
}

export default TransactionEditPage;
