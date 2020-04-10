import React from 'react';
import {
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/react';
import {
	ExpenseCategories, ExpenseCategory,
} from '@shared/interfaces';

interface Props {
	label: string;
	value: ExpenseCategory | null;
	onChange(category: ExpenseCategory | null): void;
}

function selectedCategoryComparison(a: ExpenseCategory | null, b: ExpenseCategory | null) {
	return a?.id === b?.id;
}

export
function ExpenseCategorySelector(props: Props) {
	const {
		label,
		value = null,
		onChange,
	} = props;

	const selectedCategory = value && ExpenseCategories.find(c => c.id === value.id);

	return (
		<IonItem>
			<IonLabel position="stacked">{label}</IonLabel>
			<IonSelect
				interface="action-sheet"
				interfaceOptions={{
					header: 'Categories',
				}}
				value={selectedCategory}
				onIonChange={({detail}) => onChange(detail.value)}
				compareWith={selectedCategoryComparison}
			>
				<IonSelectOption value={null}>Uncategoriezed</IonSelectOption>
				{ExpenseCategories.map(category => (
					<IonSelectOption
						key={category.id}
						value={category}
					>
						{category.label}
					</IonSelectOption>
				))}
			</IonSelect>
		</IonItem>
	);
}
