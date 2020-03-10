import React, { ReactNode } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButtons,
	IonMenuButton,
	IonList,
	IonIcon,
	IonFab,
	IonFabButton,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	IonItem,
} from '@ionic/react';
import { alertController } from '@ionic/core';
import { add } from 'ionicons/icons';
import { useCollection } from '../hooks';
import { Collection, CollectionType } from '../interfaces';
import { deleteDoc } from '../api';

type ItemRenderFn<T> = (doc: T) => ReactNode;

interface Props<T> {
	itemRenderFn: ItemRenderFn<T>;
	collectionType: Collection;
	label: string;
	editPath: string;
}

export
function CollectionPage<T extends CollectionType>(props: Props<T>) {
	const {
		collectionType,
		label,
		editPath,
		itemRenderFn,
	} = props;
	const collection = useCollection<T>(collectionType);

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
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{label}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					{collection.map(doc =>(
						<IonItemSliding key={doc.id}>
							<IonItemOptions side="start">
								<IonItemOption
									expandable
									color="danger"
									onClick={() => handleDeleteClick(doc)}
								>
									Delete
								</IonItemOption>
							</IonItemOptions>
							<IonItem
								routerLink={`${editPath}/${doc.id}`}
								routerDirection="forward"
							>
								{itemRenderFn(doc)}
							</IonItem>
						</IonItemSliding>
					))}
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink={editPath}
						routerDirection="forward"
					>
						<IonIcon icon={add} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}
