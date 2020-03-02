import React, { ReactNode } from 'react';
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

interface Props {
	canSave?: boolean;
	children: ReactNode;
	defaultHref: string;
	editing: boolean;
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
	} = props;

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

				{children}

				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink={defaultHref}
						routerDirection="back"
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
