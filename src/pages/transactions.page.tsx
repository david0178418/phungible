import React, {
} from 'react';
import {
	IonIcon,
	IonLabel,
	IonText,
} from '@ionic/react';
import {
	arrowUp,
	arrowDown,
} from 'ionicons/icons';
import {
	Transaction,
	Collection,
	TransactionType,
} from '../interfaces';
import { CollectionPage } from '../components/collection-page';

export
function TransactionsPage() {
	return (
		<CollectionPage
			collectionType={Collection.Transactions}
			label="Transactions"
			editPath="/transaction"
			itemRenderFn={(doc: Transaction) => (
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

export default TransactionsPage;
