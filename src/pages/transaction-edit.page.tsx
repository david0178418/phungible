import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createTransaction, saveProfileDoc, getDoc } from '@common/api';
import { Collection, Transaction } from '@common/interfaces';
import { TransactionEditForm } from '@components/transaction-edit-form';
import { EditPage } from '@components/edit-page';
import { useEditItem } from '@common/hooks';
import { canSaveTransaction } from '@common/validations';
import { ProfileContext } from '@common/contexts';

export
function TransactionEditPage() {
	const profile = useContext(ProfileContext);
	const profileId = profile?.id || '';
	const [
		transaction,
		setTransaction,
		resetTransaction,
		isValid,
	] = useEditItem(() => createTransaction(profileId), canSaveTransaction);
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
		if(!(isValid && transaction)) {
			return;
		}

		const result = await saveProfileDoc(transaction, Collection.Transactions);
		result && goBack();
	}

	return (
		<EditPage
			defaultHref="/transactions"
			canSave={isValid}
			editing={!!id}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<TransactionEditForm
				transaction={transaction}
				onUpdate={newTransaction => setTransaction(newTransaction)}
			/>
		</EditPage>
	);
}

export default TransactionEditPage;
