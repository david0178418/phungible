import React, { useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonGrid,
	IonRow,
	IonCol,
	IonSegment,
	IonSegmentButton,
} from '@ionic/react';

enum RepetitionTab {
	DayOfWeek = 'dayofweek',
	Date = 'date',
	Interval = 'interval',
}

export
function RepetitionSelector() {
	const [selectedTab, setSelectedTab] = useState<RepetitionTab>(RepetitionTab.DayOfWeek);

	return (
		<>
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
		</>
	);
}
