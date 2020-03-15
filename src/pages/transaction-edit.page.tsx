import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import equal from 'fast-deep-equal';
import { createTransaction, saveDoc, getDoc } from '../api';
import { Collection, TransactionType, Transaction } from '../interfaces';
import { TransactionEditForm } from '../components/transaction-edit-form';
import { EditPage } from '../components/edit-page';

export
function TransactionEditPage() {
	const [original, setOriginal] = useState(createTransaction);
	const [
		transaction,
		setTransaction,
	] = useState(createTransaction);
	const [isValid, setIsValid] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);

	useEffect(() => {
		setHasChanged(!equal(transaction, original));
	}, [transaction, original]);

	useEffect(() => {
		setIsValid(hasChanged && canSave());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, transaction]);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Transaction>(`${Collection.Transactions}/${id}`);
				if(a) {
					setTransaction({...a});
					setOriginal({...a});
				}
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	function canSave() {
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
