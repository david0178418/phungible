import React, { useContext } from 'react';
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
import { AccountsContext } from '../contexts';
import { moneyFormat, findById } from '../utils';

export
function TransactionsPage() {
	const accounts = useContext(AccountsContext);
	return (
		<CollectionPage
			collectionType={Collection.Transactions}
			label="Transactions"
			editPath="/transaction"
			itemRenderFn={(doc: Transaction) => {
				const fromAccount = findById(doc.fromAccountId, accounts);
				const towardAccount = findById(doc.towardAccountId, accounts);
				return (
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
								{fromAccount && (
									<p>
										From: {fromAccount.name}
									</p>
								)}
								{towardAccount && (
									<p>
										Toward: {towardAccount.name}
									</p>
								)}
							</IonLabel>
						</div>
						<IonText
							slot="end"
							color={doc.type === TransactionType.Income ? 'money' : 'debt'}
						>
							${moneyFormat(doc.amount)}
						</IonText>
					</>
				);
			}}
		/>
	);
}

export default TransactionsPage;
