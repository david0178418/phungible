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
	IonButton,
} from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import { loadingController } from '@ionic/core';

interface Props {
	canSave: boolean;
	children: ReactNode;
	defaultHref?: string;
	editing: boolean;
	loading?: boolean;
	onSubmit(): void;
	onClose?(): void;
}

export
function EditPage(props: Props) {
	const {
		canSave,
		children,
		defaultHref,
		editing,
		onSubmit,
		onClose,
		loading,
	} = props;
	const loaderRef = useRef<HTMLIonLoadingElement | null>(null);

	useEffect(() => {
		(async () => {
			if(loading && !loaderRef.current) {
				const top = await loadingController.getTop();

				if(top) {
					return;
				}

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
						{defaultHref && (
							<IonBackButton defaultHref={defaultHref} />
						)}
						{onClose && (
							<IonButton onClick={onClose}>
								<IonIcon icon={close}/>
							</IonButton>
						)}
					</IonButtons>
					<IonTitle>
						{editing ? 'Edit' : 'Create'}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding content-overscroll">

				{!loading && children}

				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						disabled={!canSave}
						onClick={onSubmit}
					>
						<IonIcon icon={checkmark} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}
