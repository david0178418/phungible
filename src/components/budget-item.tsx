import React, { useEffect, useState } from 'react';
import { IonLabel, IonText, IonNote, IonSpinner } from '@ionic/react';
import { Budget, Collection, Transaction } from '@common/interfaces';
import { moneyFormat } from '@common/utils';
import { nextOccuranceText, currentPeriod } from '@common/budget-fns';
import { getCollectionRef } from '@common/api';

interface Props {
	budget: Budget;
}

export
function BudgetItem(props: Props) {
	const [loading, setLoading] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const {
		budget,
	} = props;
	const remaningAmount = budget.amount - transactions
		.reduce((total, t) =>  total + t.amount, 0);

	useEffect(() => {
		let isMounted = true;
		const [start, end] = currentPeriod(budget);

		setLoading(true);

		getCollectionRef(Collection.Transactions)
			.where('date', '>=', start)
			.where('date', '<', end)
			.get()
			.then(collection => {
				if(isMounted) {
					setTransactions(collection.docs.map(t => t.data() as Transaction));
					setLoading(false);
				}
			});
		
		return () => {
			isMounted = false;
		};
	}, [budget]);

	return (
		<>
			<IonText slot="start" color={budget.amount > 0 ? 'money' : 'debt'}>
				{loading ? (
					<IonSpinner />
				) : (
					<>
						${moneyFormat(remaningAmount)}
					</>
				)}
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
