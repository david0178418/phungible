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
import { moneyFormat } from '@shared/utils';
import { getCollectionRef } from '@common/api';

function fromAccount(type: AccountType) {
	return (transaction: Transaction) => (
		transaction.amount * (
			type === AccountType.Debt ?
				1: -1
		)
	);
}

function towardAccount(type: AccountType) {
	return (transaction: Transaction) => (
		transaction.amount * (
			type === AccountType.Debt ?
				-1: 1
		)
	);
}

interface Props {
	account: Account;
}

export
function AccountItem(props: Props) {
	const [fromTransactions, setFromTransactions] = useState<Transaction[]>([]);
	const [towardTransactions, setTowardTransactions] = useState<Transaction[]>([]);
	const [balance, setBalance] = useState(0);
	const [pendingAmount, setPendingAmount] = useState(0);
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
			.filter(t => !t.pending)
			.map(fromAccount(account.type))
			.reduce((sum, x) => sum + x, 0);

		const fromPendingTotal = fromTransactions
			.filter(t => t.pending)
			.map(fromAccount(account.type))
			.reduce((sum, x) => sum + x, 0);

		const towardTotal = towardTransactions
			.filter(t => !t.pending)
			.map(towardAccount(account.type))
			.reduce((sum, x) => sum + x, 0);

		const towardPendingTotal = towardTransactions
			.filter(t => t.pending)
			.map(towardAccount(account.type))
			.reduce((sum, x) => sum + x, 0);

		setBalance(account.balanceUpdateHistory[0].balance + fromTotal + towardTotal);
		setPendingAmount(fromPendingTotal + towardPendingTotal);
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
				{!!pendingAmount && (
					<IonNote>
						<em>
							{moneyFormat(pendingAmount)} pending
						</em>
					</IonNote>
				)}
			</div>
			<IonText
				slot="end"
				color={account.type === AccountType.Savings ? 'money' : 'debt'}
			>
				{moneyFormat(balance)}
			</IonText>
		</>
	);
}
