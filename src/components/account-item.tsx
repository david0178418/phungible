import React, {
} from 'react';
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
	AccountType, Account,
} from '../interfaces';
import { moneyFormat } from '../utils';

interface Props {
	account: Account;
}

export
function AccountItem(props: Props) {
	const {
		account,
	} = props;

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
				${moneyFormat(account.balanceUpdateHistory[0].balance)}
			</IonText>
		</>
	);
}
