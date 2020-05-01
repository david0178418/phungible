import React, { useContext } from 'react';
import {
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/react';
import { alertController } from '@ionic/core';
import { setCategory } from '@common/api';
import { ProfileContext, RefreshActiveProfileContext } from '@common/contexts';

interface Props {
	label: string;
	value: string;
	onChange(category: string): void;
}

export
function ExpenseCategorySelector(props: Props) {
	const profile = useContext(ProfileContext);
	const activeProfileRefresher = useContext(RefreshActiveProfileContext);
	const {
		label,
		value = '',
		onChange,
	} = props;
	// const selectedCategory = value && profile?.transactionCategories.find(c => c.id === value);

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

							onChange(newCat.id);
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
				value={value}
				onIonChange={({detail}) => {
					console.log(detail.value);
					detail.value === null ?
						openCreateCategory() :
						onChange(detail.value);
				}}
			>
				<IonSelectOption value={null} onClick={openCreateCategory}>
					Add New Category
				</IonSelectOption>
				<IonSelectOption value="">Uncategoriezed</IonSelectOption>
				{profile?.transactionCategories.map(category => (
					<IonSelectOption
						key={category.id}
						value={category.id}
					>
						{category.label}
					</IonSelectOption>
				))}
			</IonSelect>
		</IonItem>
	);
}
