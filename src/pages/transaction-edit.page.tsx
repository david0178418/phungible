import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { saveProfileDoc, getDoc } from '@common/api';
import { ProfileCollection, Transaction } from '@shared/interfaces';
import { TransactionEditForm } from '@components/transaction-edit-form';
import { EditPage } from '@components/edit-page';
import { useEditItem } from '@common/hooks';
import { canSaveTransaction } from '@common/validations';
import { ProfileContext } from '@common/contexts';
import { createTransaction } from '@shared/create-docs';

interface Params {
	id?: string;
}

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
	} = useParams<Params>();
	const [loading, setLoading] = useState(!!id);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Transaction>(`${ProfileCollection.Transactions}/${id}`);
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

		const result = await saveProfileDoc(transaction, ProfileCollection.Transactions);
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
			<>
				<TransactionEditForm
					transaction={transaction}
					onUpdate={newTransaction => setTransaction(newTransaction)}
				/>
			</>
		</EditPage>
	);
}

export default TransactionEditPage;
