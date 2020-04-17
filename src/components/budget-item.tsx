import React, { useEffect, useState } from 'react';
import { IonLabel, IonText, IonSpinner, IonNote } from '@ionic/react';
import { Budget, Collection, Transaction } from '@shared/interfaces';
import { moneyFormat } from '@shared/utils';
import { nextOccuranceText, currentPeriod } from '@common/occurrence-fns';
import { getCollectionRef } from '@common/api';

interface Props {
	budget: Budget;
}

export
function BudgetItem(props: Props) {
	const {
		budget,
	} = props;
	const [loading, setLoading] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [period, setPeriod] = useState<string[]>([]);
	const notApplicable = !period.every(date => !!date);
	const remaningAmount = budget.amount - transactions
		.reduce((total, t) => total + t.amount, 0);

	useEffect(() => {
		setPeriod(currentPeriod(budget));
	}, [budget]);

	useEffect(() => {
		let isMounted = true;

		const [start, end] = period;

		if(!(start && end)) {
			return;
		}

		setLoading(true);

		getCollectionRef(Collection.Transactions)
			.where('date', '>=', start)
			.where('date', '<', end)
			.where('parentBudgetId', '==', budget.id)
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [period]);

	return (
		<>
			<IonText slot="start" color={budget.amount > 0 ? 'money' : 'debt'}>
				{loading ? (
					<IonSpinner />
				) : (
					<>
						{notApplicable ?
							'N/A' :
							`$${moneyFormat(remaningAmount)}`
						}
					</>
				)}
			</IonText>
			<div>
				<IonLabel>
					{budget.name}
					<p>
						out of ${moneyFormat(budget.amount)}
					</p>
				</IonLabel>
				<IonNote>
					<em>
						Renews in {nextOccuranceText(budget)}
					</em>
				</IonNote>
			</div>
		</>
	);
}
