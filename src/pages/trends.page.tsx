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
import { TrendsProjection } from '@components/trends-projection';

enum Tabs {
	History = 'history',
	Projection = 'projection',
}

export
function TrendsPage() {
	const [selectedTab, setSeletedTab] = useState<Tabs>(Tabs.Projection);

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
				<IonSegment value={selectedTab}>
					<IonSegmentButton
						value={Tabs.Projection}
						onClick={() => setSeletedTab(Tabs.Projection)}
					>
						Projection
					</IonSegmentButton>
					<IonSegmentButton
						value={Tabs.History}
						onClick={() => setSeletedTab(Tabs.History)}
					>
						Breakdown
					</IonSegmentButton>
				</IonSegment>

				{selectedTab === Tabs.History && (
					<TrendsHistory />
				)}
				{selectedTab === Tabs.Projection && (
					<TrendsProjection/>
				)}
			</IonContent>
		</IonPage>
	);
}

export default TrendsPage;
