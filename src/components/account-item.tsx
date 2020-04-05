import React, { useState, useEffect } from 'react';
import {
	IonNote,
	IonText,
	IonIcon,
	IonLabel,
} from '@ionic/react';
import {
	cashOutline,
	card,
} from 'ionicons/icons';
import {
	AccountType,
	Account,
	Collection,
	Transaction,
} from '@shared/interfaces';
import { moneyFormat } from '@common/utils';
import { getCollectionRef } from '@common/api';

interface Props {
	account: Account;
}

export
function AccountItem(props: Props) {
	const [fromTransactions, setFromTransactions] = useState<Transaction[]>([]);
	const [towardTransactions, setTowardTransactions] = useState<Transaction[]>([]);
	const [balance, setBalance] = useState(0);
	const {
		account,
	} = props;

	useEffect(() => {
		const lastBalanceUpdate = account.balanceUpdateHistory[0].date;
		const now = (new Date()).toISOString();

		const fromUnsub = getCollectionRef(Collection.Transactions)
			.where('fromAccountId', '==', account.id)
			.where('date', '>=', lastBalanceUpdate)
			.where('date', '<', now)
			.onSnapshot(snap => {
				setFromTransactions(
					snap.docs.map(doc =>
						doc.data() as Transaction,
					),
				);
			});

		const towardUnsub = getCollectionRef(Collection.Transactions)
			.where('towardAccountId', '==', account.id)
			.where('date', '>=', lastBalanceUpdate)
			.where('date', '<', now)
			.onSnapshot(snap => {
				setTowardTransactions(
					snap.docs.map(doc =>
						doc.data() as Transaction,
					),
				);
			});

		return () => {
			fromUnsub();
			towardUnsub();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const fromTotal = fromTransactions
			.map(t =>
				t.amount * (
					account.type === AccountType.Debt ?
						1: -1
				),
			)
			.reduce((sum, x) => sum + x, 0);
		const towardTotal = towardTransactions
			.map(t =>
				t.amount * (
					account.type === AccountType.Debt ?
						-1: 1
				),
			)
			.reduce((sum, x) => sum + x, 0);

		setBalance(account.balanceUpdateHistory[0].balance + fromTotal + towardTotal);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromTransactions, towardTransactions]);

	return (
		<>
			{account.type === AccountType.Savings ? (
				<IonIcon
					slot="start"
					color="money"
					icon={cashOutline}
				/>
			) : (
				<IonIcon
					slot="start"
					color="debt"
					icon={card}
				/>
			)}
			<div>
				<IonLabel>
					{account.name}
				</IonLabel>
				<IonNote>
					<em>
						$X.XX pending
					</em>
				</IonNote>
			</div>
			<IonText
				slot="end"
				color={account.type === AccountType.Savings ? 'money' : 'debt'}
			>
				${moneyFormat(balance)}
			</IonText>
		</>
	);
}
