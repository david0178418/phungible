import React, { useState } from 'react';
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
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonCheckbox,
	IonSegment,
	IonSegmentButton,
	IonFab,
	IonIcon,
	IonFabButton,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { checkmark } from 'ionicons/icons';

enum RepetitionTab {
	DayOfWeek = 'dayofweek',
	Date = 'date',
	Interval = 'interval',
}

export
function BudgetEditPage() {
	const [selectedTab, setSelectedTab] = useState<RepetitionTab>(RepetitionTab.DayOfWeek);
	const {
		id = '',
	} = useParams();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonBackButton defaultHref="/budgets" />
					</IonButtons>
					<IonTitle>
						{id ? 'Edit' : 'Create'}
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonItem>
								<IonLabel position="stacked">
									Name
								</IonLabel>
								<IonInput />
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
					Add Another
				</IonButton>

				<IonItem>
					<IonLabel position="stacked">
						Starts
					</IonLabel>
					<IonInput type="date" />
				</IonItem>

				<IonItem>
					<IonLabel position="stacked">
						From
					</IonLabel>
					<IonSelect>
						<IonSelectOption>
							Savings
						</IonSelectOption>
						<IonSelectOption>
							Credit Card
						</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonLabel>
						Repeats
					</IonLabel>
					<IonCheckbox slot="start" />
				</IonItem>

				<p>
					<IonLabel>
						Next Occurance: N/A
					</IonLabel>
				</p>

				<IonSegment
					color="primary"
					value={selectedTab}
					onIonChange={e => setSelectedTab(e.detail.value as RepetitionTab)}
				>
					<IonSegmentButton value={RepetitionTab.DayOfWeek}>
						Day
					</IonSegmentButton>
					<IonSegmentButton value={RepetitionTab.Date}>
						Date
					</IonSegmentButton>
					<IonSegmentButton value={RepetitionTab.Interval}>
						Interval
					</IonSegmentButton>
				</IonSegment>

				{selectedTab === RepetitionTab.DayOfWeek && (
					'Week View'
				)}
				{selectedTab === RepetitionTab.Date && (
					'Date View'
				)}
				{selectedTab === RepetitionTab.Interval && (
					<>
						<IonLabel>
							<p>
								Every
							</p>
						</IonLabel>
						<IonGrid>
							<IonRow>
								<IonCol size="2">
									<IonItem>
										<IonInput value={0} type="number" />
									</IonItem>
								</IonCol>
								<IonCol>
									<IonItem>
										<IonSelect>
											<IonSelectOption>
												Day
											</IonSelectOption>
											<IonSelectOption>
												Week
											</IonSelectOption>
											<IonSelectOption>
												Month
											</IonSelectOption>
											<IonSelectOption>
												Year
											</IonSelectOption>
										</IonSelect>
									</IonItem>
								</IonCol>
							</IonRow>
						</IonGrid>
					</>
				)}

				<IonFab vertical="bottom" horizontal="end" slot="fixed">
					<IonFabButton
						color="secondary"
						routerLink="/budgets/"
						routerDirection="back"
					>
						<IonIcon icon={checkmark} />
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
}

export default BudgetEditPage;
