import React, { useState, useEffect } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
	IonTextarea,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import equal from 'fast-deep-equal';
import { format, parse } from 'date-fns';
import { EditPage } from '../components/edit-page';
import { AccountSelector } from '../components/account-selector';
import { createTransaction, saveDoc, getDoc } from '../api';
import { Collection, TransactionType, Transaction } from '../interfaces';
import { useStatePropSetter } from '../hooks';
import { TransactionTypeSelector } from '../components/transaction-type-selector';
import { MoneyInput } from '../components/money-input';

export
function TransactionEditPage() {
	const [original, setOriginal] = useState(createTransaction);
	const [
		transaction,
		setTransaction,
		setProp,
	] = useStatePropSetter(createTransaction);
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

	function handleTransactionTypeUpdate(type: TransactionType) {
		const fromAccountId = type === TransactionType.Income ?
			'' :
			transaction.fromAccountId;

		const towardAccountId = type === TransactionType.Expense ?
			'' :
			transaction.towardAccountId;
		
		setTransaction({
			...transaction,
			type,
			towardAccountId,
			fromAccountId,
		});
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
			<IonGrid>
			<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Name
							</IonLabel>
							<IonInput
								value={transaction.name}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									setProp('name', detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<MoneyInput
							amount={transaction.amount}
							onUpdate={(amount) => {
								setProp('amount', amount);
							}}
						/>
					</IonCol>
				</IonRow>
			</IonGrid>

			<TransactionTypeSelector
				type={transaction.type}
				onSelect={handleTransactionTypeUpdate}
			/>

			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonTextarea
					onIonChange={({detail}) => setProp('notes', detail.value || '')}
				/>
			</IonItem>
			<IonItem>
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput
					type="date"
					value={format(new Date(transaction.date), 'yyyy-MM-dd')}
					onIonChange={({detail}) => {
						if(typeof detail.value === 'string') {
							detail.value && setProp('date', parse(detail.value, 'yyyy-MM-dd', new Date()).toISOString());
						}
					}}
				/>
			</IonItem>
			{transaction.type !== TransactionType.Income && (
				<AccountSelector
					label="From Account"
					value={transaction.fromAccountId}
					onChange={account => setProp('fromAccountId', account)}
				/>
			)}

			{transaction.type !== TransactionType.Expense && (
				<AccountSelector
					label="Toward Account"
					value={transaction.towardAccountId}
					onChange={account => setProp('towardAccountId', account)}
				/>
			)}
		</EditPage>
	);
}

export default TransactionEditPage;
