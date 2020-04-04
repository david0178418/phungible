import React, { useState, useEffect, useContext } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
	IonTextarea,
} from '@ionic/react';
import equal from 'fast-deep-equal';
import { useParams, useHistory } from 'react-router-dom';
import {
	RecurringTransaction,
	Collection,
	RepeatType,
	TransactionType,
} from '@common/interfaces';
import {
	createRecurringTransaction,
	getDoc,
	saveProfileDoc,
} from '@common/api';
import { format, parse, startOfDay } from 'date-fns';
import { EditPage } from '@components/edit-page';
import { AccountSelector } from '@components/account-selector';
import { RepetitionSelector } from '@components/repetition-selector';
import { TransactionTypeSelector } from '@components/transaction-type-selector';
import { useStatePropSetter } from '@common/hooks';
import { MoneyInput } from '@components/money-input';
import { ProfileContext } from '@common/contexts';

export
function RecurringTransactionEditPage() {
	const profile = useContext(ProfileContext);
	const profileId = profile?.id || '';
	const [original, setOriginal] = useState(() => createRecurringTransaction(profileId));
	const [
		transaction,
		setTransaction,
		setProp,
	] = useStatePropSetter(() => createRecurringTransaction(profileId));
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
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
				const a = await getDoc<RecurringTransaction>(`${Collection.RecurringTransactions}/${id}`);
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
			repeatType,
			repeatValues,
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
			)&& (
				!repeatType ||
				repeatValues.length
			)
		);
	}

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveProfileDoc(transaction, Collection.RecurringTransactions);
		result && goBack();
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

	function handleRepetitionUpdate(repeatType: RepeatType | null, repeatValues: number[], repeatUnit = transaction.repeatUnit) {
		setTransaction({
			...transaction,
			repeatType,
			repeatValues,
			repeatUnit,
		});
	}

	return (
		<EditPage
			defaultHref="/recurring-transactions"
			editing={!!id}
			canSave={isValid}
			onSubmit={handleSubmit}
			loading={loading}
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
							detail.value && setProp('date', startOfDay(parse(detail.value, 'yyyy-MM-dd', new Date())).toISOString());
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

			<RepetitionSelector
				date={transaction.date}
				type={transaction.repeatType}
				values={transaction.repeatValues}
				unit={transaction.repeatUnit}
				onUpdate={handleRepetitionUpdate}
			/>
		</EditPage>
	);
}

export default RecurringTransactionEditPage;
