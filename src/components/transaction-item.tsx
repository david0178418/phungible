import React, { useContext } from 'react';
import { IonIcon, IonLabel, IonText } from '@ionic/react';
import { arrowUp, arrowDown } from 'ionicons/icons';
import { Transaction, TransactionType } from '@common/interfaces';
import { AccountsContext } from '@common/contexts';
import { findById, moneyFormat } from '@common/utils';

interface Props {
	transaction: Transaction;
}

export
function TransactionItem(props: Props) {
	const {
		transaction,
	} = props;

	const accounts = useContext(AccountsContext);
	const fromAccount = findById(transaction.fromAccountId, accounts);
	const towardAccount = findById(transaction.towardAccountId, accounts);

	return (
		<>
			
			{transaction.type === TransactionType.Income ? (
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
					{transaction.name}
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
				color={transaction.type === TransactionType.Income ? 'money' : 'debt'}
			>
				${moneyFormat(transaction.amount)}
			</IonText>
		</>
	);
}
