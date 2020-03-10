import React, {
} from 'react';
import {
	IonIcon,
	IonLabel,
	IonText,
} from '@ionic/react';
import {
	Collection,
	RecurringTransaction,
	TransactionType,
} from '../interfaces';
import { arrowUp, arrowDown } from 'ionicons/icons';
import { CollectionPage } from '../components/collection-page';

export
function RecurringPage() {
	return (
		<CollectionPage<RecurringTransaction>
			collectionType={Collection.RecurringTransactions}
			label="Recurring Transactions"
			editPath="/recurring-transaction"
			itemRenderFn={(doc) => (
				<>
					{doc.type === TransactionType.Income ? (
						<IonIcon
							slot="start"
							color="money"
							icon={arrowUp}
						/>
					) : (
						<IonIcon
							slot="start"
							color="debt"
							icon={arrowDown}
						/>
					)}
					<div>
						<IonLabel>
							{doc.name}
							<p>
								Next: ???
							</p>
						</IonLabel>
					</div>
					<IonText
						slot="end"
						color={doc.type === TransactionType.Income ? 'money' : 'debt'}
					>
						${doc.amount}
					</IonText>
				</>
			)}
		/>
	);
}

export default RecurringPage;
