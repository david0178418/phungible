import React, { useState, useEffect } from 'react';
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
import { RepetitionSelector } from '../components/repetition-selector';
import { EditPage } from '../components/edit-page';
import { createBudget, getDoc, saveDoc } from '../api';
import { Budget, Collection } from '../interfaces';
import { AccountSelector } from '../components/account-selector';

export
function BudgetEditPage() {
	const [originalBudget, setOriginalBudget] = useState(createBudget);
	const [budget, setBudget] = useState(createBudget);
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();

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
			name,
		} = budget;
		return !!(
			name
		);
	}

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveDoc(budget, Collection.Budgets);
		result && goBack();
	}

	return (
		<EditPage
			defaultHref="/budgets"
			editing={!!id}
			canSave={isValid}
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
								value={budget.name}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									setProp('name', detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked">
								$
							</IonLabel>
							<IonInput
								type="number"
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
				<IonLabel position="stacked">
					Starts
				</IonLabel>
				<IonInput type="date" />
			</IonItem>

			<AccountSelector
				value={budget.fromAccountId || ''}
				onChange={newId => setProp('fromAccountId', newId)}
			/>

			<RepetitionSelector />
		</EditPage>
	);
}

export default BudgetEditPage;
