import React, { useContext } from 'react';
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
import { moneyFormat, findById } from '../utils';
import { AccountsContext } from '../contexts';
import { nextOccuranceText } from '../budget-fns';

export
function RecurringPage() {
	const accounts = useContext(AccountsContext);
	return (
		<CollectionPage
			collectionType={Collection.RecurringTransactions}
			label="Recurring Transactions"
			editPath="/recurring-transaction"
			itemRenderFn={(doc: RecurringTransaction) => {
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
								<p>
									Next occurance in {nextOccuranceText(doc)}
								</p>
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

export default RecurringPage;
