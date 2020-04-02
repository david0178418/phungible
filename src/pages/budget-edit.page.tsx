import React, { useState, useEffect, useContext } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import equal from 'fast-deep-equal';
import { RepetitionSelector } from '@components/repetition-selector';
import { EditPage } from '@components/edit-page';
import { createBudget, getDoc, saveProfileDoc } from '@common/api';
import { Budget, Collection, RepeatType } from '@common/interfaces';
import { AccountSelector } from '@components/account-selector';
import { format, parse, startOfDay } from 'date-fns';
import { MoneyInput } from '@components/money-input';
import { UserMetaContext } from '@common/contexts';

export
function BudgetEditPage() {
	const userMeta = useContext(UserMetaContext);
	const profileId = userMeta?.lastOpenProfile || '';
	const [originalBudget, setOriginalBudget] = useState(() => createBudget(profileId));
	const [budget, setBudget] = useState(() => createBudget(profileId));
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);

	useEffect(() => {
		setHasChanged(!equal(budget, originalBudget));
	}, [budget, originalBudget]);

	useEffect(() => {
		setIsValid(hasChanged && canSave());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, budget]);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Budget>(`${Collection.Budgets}/${id}`);
				if(a) {
					setOriginalBudget(a);
					setBudget(a);
				}
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function setProp<T extends keyof Budget>(prop: T, value: Budget[T]) {
		setBudget({
			...budget,
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
			date,
		} = budget;

		return !!(
			amount &&
			fromAccountId &&
			name &&
			date && (
				!repeatType ||
				repeatValues.length
			)
		);
	}

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveProfileDoc(budget, Collection.Budgets);
		result && goBack();
	}

	function handelRepetitionUpdate(repeatType: RepeatType | null, repeatValues: number[], repeatUnit = budget.repeatUnit) {
		setBudget({
			...budget,
			repeatType,
			repeatValues,
			repeatUnit,
		});
	}

	return (
		<EditPage
			defaultHref="/budgets"
			editing={!!id}
			canSave={isValid}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Name
							</IonLabel>
							<IonInput
								value={budget.name}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									setProp('name', detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<MoneyInput
							amount={budget.amount}
							onUpdate={amount => {
								setProp('amount', amount);
							}}
						/>
					</IonCol>
				</IonRow>
			</IonGrid>

			<IonItem>
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput
					type="date"
					value={format(new Date(budget.date), 'yyyy-MM-dd')}
					onIonChange={({detail}) => {
						if(typeof detail.value === 'string') {
							detail.value && setProp('date', startOfDay(parse(detail.value, 'yyyy-MM-dd', new Date())).toISOString());
						}
					}}
				/>
			</IonItem>

			<AccountSelector
				label="From Account"
				value={budget.fromAccountId || ''}
				onChange={newId => setProp('fromAccountId', newId)}
			/>

			<RepetitionSelector
				date={budget.date}
				type={budget.repeatType}
				values={budget.repeatValues}
				unit={budget.repeatUnit}
				onUpdate={handelRepetitionUpdate}
			/>
		</EditPage>
	);
}

export default BudgetEditPage;
