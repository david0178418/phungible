import React, { useContext } from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { BudgetContext } from '@common/contexts';

interface Props {
	value: string;
	onChange(id: string): void;
}

export
function BudgetSelector(props: Props) {
	const budgets = useContext(BudgetContext);
	const {
		value,
		onChange,
	} = props;

	if(!budgets) {
		return null;
	}

	return (
		<IonItem>
			<IonLabel position="stacked">From Budget</IonLabel>
			<IonSelect value={value} onIonChange={({detail}) => onChange(detail.value)}>
				<IonSelectOption value="">None</IonSelectOption>
				{budgets.map(budget => (
					<IonSelectOption
						key={budget.id}
						value={budget.id}
					>
						{budget.name}
					</IonSelectOption>
				))}
			</IonSelect>
		</IonItem>
	);
}
