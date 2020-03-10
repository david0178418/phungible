import React, { ReactNode, useEffect, useRef } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonButtons,
	IonBackButton,
	IonFab,
	IonIcon,
	IonFabButton,
} from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { loadingController } from '@ionic/core';

interface Props {
	canSave: boolean;
	children: ReactNode;
	defaultHref: string;
	editing: boolean;
	loading?: boolean;
	handleSubmit(): void;
}

export
function EditPage(props: Props) {
	const {
		canSave,
		children,
		defaultHref,
		editing,
		handleSubmit,
		loading,
	} = props;
	const loaderRef = useRef<HTMLIonLoadingElement | null>(null);

	useEffect(() => {
		(async () => {
			if(loading && !loaderRef.current) {
				loaderRef.current = await loadingController.create({});
				loaderRef.current.present();
			} else if(!loading && loaderRef.current) {
				loaderRef.current.dismiss();
			}
		})();
	}, [loading]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonBackButton defaultHref={defaultHref} />
					</IonButtons>
					<IonTitle>
						{editing ? 'Edit' : 'Create'}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">

				{!loading && children}

				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						disabled={!canSave}
						onClick={handleSubmit}
					>
						<IonIcon icon={checkmark} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}
