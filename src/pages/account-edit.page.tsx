import React, {
} from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonItem,
	IonLabel,
	IonInput,
	IonButtons,
	IonBackButton,
	IonSelect,
	IonSelectOption,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonList,
	IonFab,
	IonFabButton,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { cashOutline, trash, checkmark} from 'ionicons/icons';

export
function AccountEditPage() {
	const {
		id = '',
	} = useParams();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonBackButton defaultHref="/accounts" />
					</IonButtons>
					<IonTitle>
						{id ? 'Edit' : 'Create'}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonItem>
					<IonLabel position="stacked">
						Name
					</IonLabel>
					<IonInput />
				</IonItem>
				<IonItem>
					<IonIcon
						slot="start"
						color="money"
						icon={cashOutline}
					/>
					<IonSelect interface="popover" placeholder="Type">
						<IonSelectOption value="brown">
							Money
						</IonSelectOption>
						<IonSelectOption value="blonde">
							Debt
						</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonLabel position="stacked">
						Notes
					</IonLabel>
					<IonInput />
				</IonItem>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position="stacked">
									Balance at start of
								</IonLabel>
								<IonInput type="date" />
							</IonItem>
						</IonCol>
						<IonCol size="3">
							<IonItem>
								<IonLabel position="stacked">
									$
								</IonLabel>
								<IonInput type="number"/>
							</IonItem>
						</IonCol>
					</IonRow>
				</IonGrid>
				<IonButton expand="full">
					Add Balance
				</IonButton>
				<IonItem lines="none">
					<IonLabel>
						<p>
							Account Balance History
						</p>
					</IonLabel>
				</IonItem>
				<IonItem lines="none">
					<IonLabel color="danger">
						At least one account balance update required.
					</IonLabel>
				</IonItem>
				<IonList>
					<IonItem>
						<IonLabel>
							$10.00
							<p>
								as of 1/1/2020
							</p>
						</IonLabel>
						<IonButton slot="end" fill="clear">
							<IonIcon slot="icon-only" icon={trash} />
						</IonButton>
					</IonItem>
					<IonItem>
						<IonLabel>
							$10.00
							<p>
								as of 1/1/2020
							</p>
						</IonLabel>
						<IonButton slot="end" fill="clear">
							<IonIcon slot="icon-only" icon={trash} />
						</IonButton>
					</IonItem>
				</IonList>
				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink="/accounts/"
						routerDirection="back"
					>
						<IonIcon icon={checkmark} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default AccountEditPage;
