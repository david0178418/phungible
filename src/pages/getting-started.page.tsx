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
import { AccountsContext, BudgetContext } from '@common/contexts';
import { useCollection } from '@common/hooks';
import { Collection, RecurringTransaction } from '@common/interfaces';
import { RecurringTransactionItem } from '@components/recurring-transaction-item';
import { BudgetItem } from '@components/budget-item';
import { AccountItem } from '@components/account-item';

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
					<IonIcon slot="end" icon={peopleOutline}/>
					<IonLabel>
						Accounts
					</IonLabel>
				</IonItem>
				<IonList>
					{accounts.map(account => (
						<IonItem key={account.id}>
							<AccountItem account={account} />
						</IonItem>
					))}
				</IonList>
				<IonItem button>
					<IonIcon slot="end" icon={walletOutline}/>
					<IonLabel>
						Budgets
					</IonLabel>
				</IonItem>
				<IonList>
					{budgets.map(budget => (
						<IonItem key={budget.id}>
							<BudgetItem budget={budget} />
						</IonItem>
					))}
				</IonList>
				<IonItem button>
					<IonIcon slot="end" icon={repeat}/>
					<IonLabel>
						Recurring Transactions
					</IonLabel>
				</IonItem>
				<IonList>
					{recurringTransactions.map(rt => (
						<IonItem key={rt.id}>
							<RecurringTransactionItem
								recurringTransaction={rt}
							/>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonPage>
	);
}

export default GettingStartedPage;
