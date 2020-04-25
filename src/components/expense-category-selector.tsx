import React, { useContext } from 'react';
import {
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/react';
import { alertController } from '@ionic/core';
import { ExpenseCategory } from '@shared/interfaces';
import { setCategory } from '@common/api';
import { ProfileContext, RefreshActiveProfileContext } from '@common/contexts';

interface Props {
	label: string;
	value: ExpenseCategory | null;
	onChange(category: ExpenseCategory | null): void;
}

function selectedCategoryComparison(a: ExpenseCategory | null, b: ExpenseCategory | null) {
	const aId = a && a.id;
	const bId = b && b.id;

	return aId === bId;
}

export
function ExpenseCategorySelector(props: Props) {
	const profile = useContext(ProfileContext);
	const activeProfileRefresher = useContext(RefreshActiveProfileContext);
	const {
		label,
		value = null,
		onChange,
	} = props;
	const selectedCategory = value && profile?.transactionCategories.find(c => c.id === value.id);

	async function openCreateCategory() {
		const alert = await alertController.create({
			header: 'Create Category',
			inputs: [{
				name: 'catName',
				type: 'text',
			}],
			buttons: [
				'Cancel',
				{
					text: 'Create Category',
					handler: async (alertData) => {
						if(profile?.id && alertData.catName.trim()) {
							const newCat = await setCategory({
								label: alertData.catName,
							}, profile);

							if(!newCat) {
								return;
							}

							await activeProfileRefresher();

							onChange(newCat);
						}
					},
				},
			],
		});

		alert.present();
	}

	return (
		<IonItem>
			<IonLabel position="stacked">{label}</IonLabel>
			<IonSelect
				interface="action-sheet"
				interfaceOptions={{
					header: 'Categories',
				}}
				value={selectedCategory || value}
				onIonChange={({detail}) => {
					onChange(detail.value || null);
					detail.value === false && openCreateCategory();
				}}
				compareWith={selectedCategoryComparison}
			>
				<IonSelectOption value={false} onClick={openCreateCategory}>
					Add New Category
				</IonSelectOption>
				<IonSelectOption value={null}>Uncategoriezed</IonSelectOption>
				{profile?.transactionCategories.map(category => (
					<IonSelectOption
						key={category.id}
						value={category}
					>
						{category.label}
					</IonSelectOption>
				))}
				{!selectedCategory && value && (
					<IonSelectOption
						key={value.id}
						value={value}
					>
						{value.label}
					</IonSelectOption>
				)}
			</IonSelect>
		</IonItem>
	);
}
