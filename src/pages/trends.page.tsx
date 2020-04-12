import React, { useState } from 'react';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonPage,
	IonContent,
	IonMenuButton,
	IonSegment,
	IonSegmentButton,
	IonButtons,
} from '@ionic/react';
import { TrendsHistory } from '@components/trends-history';

enum Tabs {
	History = 'history',
	Projection = 'projection',
}

export
function TrendsPage() {
	const [selectedTab, setSeletedTab] = useState<Tabs>(Tabs.History);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Trends</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<p>
					Work in progress
				</p>
				<IonSegment value={selectedTab}>
					<IonSegmentButton
						value={Tabs.History}
						onClick={() => setSeletedTab(Tabs.History)}
					>
						Breakdown
					</IonSegmentButton>
					<IonSegmentButton
						value={Tabs.Projection}
						onClick={() => setSeletedTab(Tabs.Projection)}
					>
						Projection
					</IonSegmentButton>
				</IonSegment>

				{selectedTab === Tabs.History && (
					<TrendsHistory />
				)}
				{selectedTab === Tabs.Projection && (
					<>
						Work in progress.
					</>
				)}
			</IonContent>
		</IonPage>
	);
}

export default TrendsPage;
