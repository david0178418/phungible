import React, { useContext } from 'react';
import {
	IonPage,
	IonItem,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonIcon,
	IonContent,
	IonLabel,
	IonList,
} from '@ionic/react';
import { peopleOutline, walletOutline, repeat } from 'ionicons/icons';
import { AccountsContext, BudgetContext } from 'src/contexts';
import { useCollection } from 'src/hooks';
import { Collection, RecurringTransaction } from 'src/interfaces';

export
function GettingStartedPage() {
	const accounts = useContext(AccountsContext);
	const budgets = useContext(BudgetContext);
	const recurringTransactions = useCollection<RecurringTransaction>(Collection.RecurringTransactions);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Getting Started</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonItem button>
					<IonIcon slot="start" icon={peopleOutline}/>
					<IonLabel>
						Accounts
					</IonLabel>
				</IonItem>
				<IonList>
					{accounts.map(account => (
						account.name
					))}
				</IonList>
				<IonItem button>
					<IonIcon slot="start" icon={walletOutline}/>
					<IonLabel>
						Budgets
					</IonLabel>
				</IonItem>
				<IonList>
					{budgets.map(budget => (
						budget.name
					))}
				</IonList>
				<IonItem button>
					<IonIcon slot="start" icon={repeat}/>
					<IonLabel>
						Recurring Transactions
					</IonLabel>
				</IonItem>
				<IonList>
					{recurringTransactions.map(recurringTransaction => (
						recurringTransaction.name
					))}
				</IonList>
			</IonContent>
		</IonPage>
	);
}

export default GettingStartedPage;
