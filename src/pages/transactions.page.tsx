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
import { Account } from '../interfaces';

function findAccount(id: string, accounts: Account[]) {
	return accounts.find(a => a.id === id);
}

export
function TransactionsPage() {
	const accounts = useContext(AccountsContext);
	return (
		<CollectionPage
			collectionType={Collection.Transactions}
			label="Transactions"
			editPath="/transaction"
			itemRenderFn={(doc: Transaction) => {
				const fromAccount = findAccount(doc.fromAccountId, accounts);
				const towardAccount = findAccount(doc.towardAccountId, accounts);
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
										From: {towardAccount.name}
									</p>
								)}
							</IonLabel>
						</div>
						<IonText
							slot="end"
							color={doc.type === TransactionType.Income ? 'money' : 'debt'}
						>
							${doc.amount}
						</IonText>
					</>
				);
			}}
		/>
	);
}

export default TransactionsPage;
