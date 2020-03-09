import React, { useState, useEffect } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import { RecurringTransaction, Collection, RepeatType } from '../interfaces';
import equal from 'fast-deep-equal';
import { useParams, useHistory } from 'react-router-dom';
import { cashOutline } from 'ionicons/icons';
import { EditPage } from '../components/edit-page';
import { AccountSelector } from '../components/account-selector';
import { createRecurringTransaction, getDoc, saveDoc } from '../api';
import { RepetitionSelector } from '../components/repetition-selector';
// import { RepetitionSelector } from '../components/repetition-selector';

export
function RecurringTransactionEditPage() {
	const [originalRecurringTransaction, setOriginalRecurringTransaction] = useState(createRecurringTransaction);
	const [recurringTransaction, setRecurringTransaction] = useState(createRecurringTransaction);
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();





	useEffect(() => {
		setHasChanged(!equal(recurringTransaction, originalRecurringTransaction));
	}, [recurringTransaction, originalRecurringTransaction]);

	useEffect(() => {
		setIsValid(hasChanged && canSave());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, recurringTransaction]);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<RecurringTransaction>(`${Collection.RecurringTransactions}/${id}`);
				if(a) {
					setOriginalRecurringTransaction(a);
					setRecurringTransaction(a);
				}
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function setProp<T extends keyof RecurringTransaction>(prop: T, value: RecurringTransaction[T]) {
		setRecurringTransaction({
			...recurringTransaction,
			[prop]: value,
		});
	}

	function canSave() {
		const {
			amount,
			fromAccountId,
			name,
			repeatType,
			repeatValues,
			startDate,
		} = recurringTransaction;

		return !!(
			amount &&
			fromAccountId &&
			name &&
			startDate && (
				!repeatType ||
				repeatValues.length
			)
		);
	}

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveDoc(recurringTransaction, Collection.RecurringTransactions);
		result && goBack();
	}

	function handelRepetitionUpdate(repeatType: RepeatType | null, repeatValues: number[], repeatUnit = recurringTransaction.repeatUnit) {
		setRecurringTransaction({
			...recurringTransaction,
			repeatType,
			repeatValues,
			repeatUnit,
		});
	}

	return (
		<EditPage
			editing={!!id}
			defaultHref="/recurring-transactions"
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
								value={recurringTransaction.name}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									setProp('name', detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked" color="money">
								$
							</IonLabel>
							<IonInput
								type="number"
								value={recurringTransaction.amount}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									setProp('amount', +detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonItem>
				<IonIcon
					slot="start"
					color="money"
					icon={cashOutline}
				/>
				<IonSelect interface="popover" placeholder="Type">
					<IonSelectOption value="brown">
						Money
					</IonSelectOption>
					<IonSelectOption value="blonde">
						Debt
					</IonSelectOption>
				</IonSelect>
			</IonItem>
			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonInput />
			</IonItem>
			<IonItem>
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput type="date" />
			</IonItem>
			<AccountSelector value="" onChange={() => null} />

			<RepetitionSelector
				type={recurringTransaction.repeatType}
				values={recurringTransaction.repeatValues}
				unit={recurringTransaction.repeatUnit}
				onUpdate={handelRepetitionUpdate}
			/>
		</EditPage>
	);
}

export default RecurringTransactionEditPage;
