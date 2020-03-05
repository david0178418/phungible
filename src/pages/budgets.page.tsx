import React, {
} from 'react';
import {
	IonLabel,
	IonNote,
} from '@ionic/react';
import { Budget, Collection } from '../interfaces';
import { CollectionPage } from '../components/collection-page';

export
function BudgetsPage() {
	return (
		<>
		<CollectionPage<Budget>
			collectionType={Collection.Budgets}
			label="Budget"
			editHref="/budget/"
			itemRenderFn={(doc) => (
				<>
					<div slot="start">
						${doc.amount}
					</div>
					<div>
						<IonLabel>
							{doc.name}
						</IonLabel>
						<IonNote>
							<em>
								$X.XX Currently Remaining
							</em>
						</IonNote>
					</div>
				</>
			)}
		/>
		</>
	);
}

export default BudgetsPage;
