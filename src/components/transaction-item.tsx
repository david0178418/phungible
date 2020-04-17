import React, { useContext } from 'react';
import { IonIcon, IonLabel, IonText, IonBadge } from '@ionic/react';
import { arrowUp, arrowDown } from 'ionicons/icons';
import { Transaction, TransactionType } from '@shared/interfaces';
import { AccountsContext, BudgetContext } from '@common/contexts';
import { findById, moneyFormat } from '@shared/utils';
import { format } from 'date-fns';

interface Props {
	transaction: Transaction;
	onClick?: () => any;
}

export
function TransactionItem(props: Props) {
	const {
		transaction,
		onClick = () => null,
	} = props;

	const accounts = useContext(AccountsContext);
	const budgets = useContext(BudgetContext);
	const fromAccount = findById(transaction.fromAccountId, accounts);
	const towardAccount = findById(transaction.towardAccountId, accounts);
	const parentBudgetName = budgets
		.find(b => b.id === transaction.parentBudgetId)
		?.name || '';


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
			<IonLabel onClick={onClick}>
				{`${format(new Date(transaction.date), 'M/d')}: `}
				<strong>
					{transaction.name}
				</strong>
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
				{parentBudgetName && (
					<IonBadge color="money">
						{parentBudgetName}
					</IonBadge>
				)}
			</IonLabel>
			<IonText
				slot="end"
				color={transaction.type === TransactionType.Income ? 'money' : 'debt'}
			>
				${moneyFormat(transaction.amount)}
			</IonText>
		</>
	);
}
