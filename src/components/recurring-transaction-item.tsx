import React, { useContext } from 'react';
import {
	IonIcon,
	IonLabel,
	IonText,
} from '@ionic/react';
import {
	RecurringTransaction,
	TransactionType,
} from '@common/interfaces';
import { arrowUp, arrowDown } from 'ionicons/icons';
import { moneyFormat, findById } from '@common/utils';
import { AccountsContext } from '@common/contexts';
import { nextOccuranceText } from '@common/budget-fns';

interface Props {
	recurringTransaction: RecurringTransaction;
}

export
function RecurringTransactionItem(props: Props) {
	const {
		recurringTransaction: rt,
	} = props;
	const accounts = useContext(AccountsContext);
	const fromAccount = findById(rt.fromAccountId, accounts);
	const towardAccount = findById(rt.towardAccountId, accounts);
	return (
		<>
			{rt.type === TransactionType.Income ? (
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
					{rt.name}
					<p>
						Next occurance in {nextOccuranceText(rt)}
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
				color={rt.type === TransactionType.Income ? 'money' : 'debt'}
			>
				${moneyFormat(rt.amount)}
			</IonText>
		</>
	);
}
