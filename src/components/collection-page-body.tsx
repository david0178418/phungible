import React, { ReactNode, Fragment } from 'react';
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
	IonLabel,
} from '@ionic/react';
import { add, addCircleOutline } from 'ionicons/icons';
import { ProfileDocs, Profile } from '@shared/interfaces';

type ItemRenderFn<T> = (doc: T) => ReactNode;

interface Props<T> {
	topContent?: ReactNode | null;
	itemRenderFn: ItemRenderFn<T>;
	collection: T[];
	onItemDelete: (item: T) => void
	canEdit?: (item: T) => boolean;
	label: string;
	editPath: string;
}

export
function CollectionPageBody<T extends (Profile | ProfileDocs)>(props: Props<T>) {
	const {
		label,
		editPath,
		itemRenderFn,
		onItemDelete,
		collection,
		topContent = null,
		canEdit = () => true,
	} = props;

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
				{topContent}
				<IonList>
					{!collection.length && (
						<IonItem
							lines="none"
							routerLink={editPath}
							routerDirection="forward"
						>
							<IonLabel>
								<em>
									Create {label}
								</em>
							</IonLabel>
							<IonIcon slot="end" icon={addCircleOutline} />
						</IonItem>
					)}
					{collection.map(doc => (
						<Fragment key={doc.id}>
							{canEdit(doc) ? (
								<IonItemSliding>
									<IonItemOptions side="start">
										<IonItemOption
											expandable
											color="danger"
											onClick={() => onItemDelete(doc)}
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
							) : (
								<IonItem
									routerLink={`${editPath}/${doc.id}`}
									routerDirection="forward"
								>
									{itemRenderFn(doc)}
								</IonItem>
							)}
						</Fragment>
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
