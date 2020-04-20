import React, { useState, useEffect, useContext } from 'react';
import {
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/react';
import { alertController } from '@ionic/core';
import { ExpenseCategory } from '@shared/interfaces';
import { getCategories, createCategory } from '@common/api';
import { ProfileContext } from '@common/contexts';

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
	const [categories, setCategories] = useState<ExpenseCategory[]>([]);
	const {
		label,
		value = null,
		onChange,
	} = props;
	const selectedCategory = value && categories.find(c => c.id === value.id);

	useEffect(() => {
		updateCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	async function updateCategories() {
		profile?.id && await getCategories(profile.id).then(setCategories);
	}

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
							const newCat = await createCategory({
								label: alertData.catName,
							}, profile.id);

							if(!newCat) {
								return;
							}

							await updateCategories();
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
				value={selectedCategory}
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
				{categories.map(category => (
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
