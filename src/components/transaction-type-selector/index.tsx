import React from 'react';
import {
	IonItem,
	IonSelect,
	IonSelectOption,
	IonIcon,
} from '@ionic/react';
import { cashOutline, card, swapHorizontal, checkmark } from 'ionicons/icons';
import { TransactionType } from '../../interfaces';
import './transaction-type-selector.scss';

const TransactionIcon = {
	[TransactionType.Income]: (
		<IonIcon
			slot="start"
			color="money"
			icon={cashOutline}
		/>
	),
	[TransactionType.Transfer]: (
		<IonIcon
			slot="start"
			color="medium"
			icon={swapHorizontal}
		/>
	),
	[TransactionType.Expense]: (
		<IonIcon
			slot="start"
			color="debt"
			icon={card}
		/>
	),
	[TransactionType.BudgetedExpense]: (
		<IonIcon
			slot="start"
			color="debt"
			icon={card}
		/>
	),
};

interface Props {
	type: TransactionType;
	onSelect: (type: TransactionType) => void;
}

export
function TransactionTypeSelector(props: Props) {
	const {
		type,
		onSelect,
	} = props;

	return (
		<IonItem className="transaction-type-selector">
			{TransactionIcon[type]}
			<IonSelect
				interface="popover"
				placeholder="Type"
				value={type}
				onIonChange={({detail}) => onSelect(detail.value)}
			>
				<IonSelectOption value={TransactionType.Income}>
					<IonIcon icon={checkmark}/>Income
				</IonSelectOption>
				<IonSelectOption value={TransactionType.Transfer}>
					Transfer
				</IonSelectOption>
				<IonSelectOption value={TransactionType.Expense}>
					Expense
				</IonSelectOption>
			</IonSelect>
		</IonItem>
	);
}
