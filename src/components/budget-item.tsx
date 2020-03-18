import React, { useEffect, useState } from 'react';
import { IonLabel, IonText, IonNote } from '@ionic/react';
import { Budget, Collection, Transaction } from '../interfaces';
import { moneyFormat } from '../utils';
import { nextOccuranceText, currentPeriod } from '../budget-fns';
import { getCollectionRef } from '../api';

interface Props {
	budget: Budget;
}

export
function BudgetItem(props: Props) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const {
		budget,
	} = props;
	const remaningAmount = budget.amount - transactions
		.reduce((total, t) =>  total + t.amount, 0);

	useEffect(() => {
		const [start, end] = currentPeriod(budget);
		getCollectionRef(Collection.Transactions)
			.where('date', '>=', start)
			.where('date', '<', end)
			.get()
			.then(collection => {
				setTransactions(collection.docs.map(y => y.data() as Transaction));
			});
	}, [budget]);

	return (
		<>
			<IonText slot="start" color={budget.amount > 0 ? 'money' : 'debt'}>
				${moneyFormat(remaningAmount)}
			</IonText>
			<div>
				<IonLabel>
					{budget.name}
					<p>
						Renews in {nextOccuranceText(budget)}
					</p>
				</IonLabel>
				<IonNote>
					<em>
						${moneyFormat(budget.amount - remaningAmount)} out of ${moneyFormat(budget.amount)} spent
					</em>
				</IonNote>
			</div>
		</>
	);
}
