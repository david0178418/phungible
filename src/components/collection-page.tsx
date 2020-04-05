import React, { ReactNode } from 'react';
import { alertController } from '@ionic/core';
import { useProfileDocCollection } from '@common/hooks';
import { Collection, ProfileDocs } from '@shared/interfaces';
import { deleteDoc } from '@common/api';
import { CollectionPageBody } from './collection-page-body';

type ItemRenderFn<T> = (doc: T) => ReactNode;

interface Props<T> {
	itemRenderFn: ItemRenderFn<T>;
	collectionType: Collection;
	label: string;
	editPath: string;
}

export
function CollectionPage<T extends ProfileDocs>(props: Props<T>) {
	const {
		collectionType,
		label,
		editPath,
		itemRenderFn,
	} = props;
	const collection = useProfileDocCollection<T>(collectionType);

	async function handleDeleteClick(doc: T) {
		const alert = await alertController.create({
			header: `Delete "${doc.name}"`,
			message:`Permanently delete "${doc.name}"?`,
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
				}, {
					text: 'Okay',
					async handler() {
						doc.id && await deleteDoc(doc.id, collectionType);
					},
				},
			],
		});

		alert.present();
	}

	return (
		<CollectionPageBody
			collection={collection}
			itemRenderFn={itemRenderFn}
			onItemDelete={handleDeleteClick}
			label={label}
			editPath={editPath}
		/>
	);
}
