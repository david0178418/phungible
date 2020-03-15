import React from 'react';
import { IonLabel, IonText, IonNote } from '@ionic/react';
import { Budget } from '../interfaces';
import { moneyFormat } from '../utils';

interface Props {
	budget: Budget;
}

export
function BudgetItem(props: Props) {
	const {
		budget,
	} = props;

	return (
		<>
			<IonText slot="start" color={budget.amount > 0 ? 'money' : 'debt'}>
				${moneyFormat(budget.amount)}
			</IonText>
			<div>
				<IonLabel>
					{budget.name}
					<p>
						Renews Feb XX, 202X
					</p>
				</IonLabel>
				<IonNote>
					<em>
						$X.XX Currently Remaining
					</em>
				</IonNote>
			</div>
		</>
	);
}
