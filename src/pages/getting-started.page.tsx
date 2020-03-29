import React, { useContext, useState } from 'react';
import {
	IonPage,
	IonItem,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonIcon,
	IonContent,
	IonList,
	IonBackButton,
	IonButtons,
	IonFooter,
	IonButton,
	IonText,
} from '@ionic/react';
import {
	peopleOutline,
	walletOutline,
	repeat,
	close,
	addOutline,
} from 'ionicons/icons';
import { AccountsContext, BudgetContext } from '@common/contexts';
import { useCollection } from '@common/hooks';
import { Collection, RecurringTransaction } from '@common/interfaces';
import { RecurringTransactionItem } from '@components/recurring-transaction-item';
import { BudgetItem } from '@components/budget-item';
import { AccountItem } from '@components/account-item';
import { useHistory } from 'react-router-dom';

export
function GettingStartedPage() {
	const [step, setStep] = useState(1);
	const accounts = useContext(AccountsContext);
	const budgets = useContext(BudgetContext);
	const recurringTransactions = useCollection<RecurringTransaction>(Collection.RecurringTransactions);
	const { goBack } = useHistory();

	const canProgress = !!(
		(step === 1) ||
		(step === 2 && accounts.length) ||
		(step === 3 && recurringTransactions.length) ||
		(step === 4 && budgets.length)
	);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar color="primary">
					<IonButtons slot="start">
						<IonBackButton icon={close} defaultHref="/" />
					</IonButtons>
					<IonTitle>Getting Started</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent class="ion-padding">
				{step === 1 && (
					<>
						<IonText>
							<h1>
								<IonIcon slot="end" icon={peopleOutline}/> Accounts
							</h1>
							<p>
								<em>Accounts</em> are simply buckets for money and debts. They can be a bank account, credit card, or even your wallet.
							</p>
						</IonText>
						<IonList>
							<IonItem routerLink="/account" routerDirection="forward">
								<IonIcon slot="start" icon={addOutline}/>
								Create an Account
							</IonItem>
							{accounts.map(account => (
								<IonItem
									key={account.id}
									routerLink={`/account/${account.id}`}
									routerDirection="forward"
								>
									<AccountItem account={account} />
								</IonItem>
							))}
						</IonList>
					</>
				)}

				{step === 2 && (
					<>
						<IonText>
							<h1>
								<IonIcon slot="end" icon={repeat}/> Recurring Transactions
							</h1>
							<p>
								<em>Recurring Transactions</em> happen at a
								known interval and at a fixed amount, such as
								payday or a car insurance payment.
							</p>
						</IonText>
						<IonList>
							<IonItem routerLink="/recurring-transaction" routerDirection="forward">
								<IonIcon slot="start" icon={addOutline}/>
								Create an Recurring Transaction
							</IonItem>
							{recurringTransactions.map(rt => (
								<IonItem
									key={rt.id}
									routerLink={`/recurring-transaction/${rt.id}`}
									routerDirection="forward"
								>
									<RecurringTransactionItem
										recurringTransaction={rt}
									/>
								</IonItem>
							))}
						</IonList>
					</>
				)}

				{step === 3 && (
					<>
						<IonText>
							<h1>
								<IonIcon slot="end" icon={walletOutline}/>
								Budgets
							</h1>
							<p>
								<em>Budgets</em> are spending categories that
								are less known ahead of time, but that you want
								limit for a given period. Examples would be
								dining out, games, or clothes.
							</p>
						</IonText>
						<IonList>
							<IonItem routerLink="/budget" routerDirection="forward">
								<IonIcon slot="start" icon={addOutline}/>
								Create an Budget
							</IonItem>
							{budgets.map(budget => (
								<IonItem
									key={budget.id}
									routerLink={`/budget/${budget.id}`}
									routerDirection="forward"
								>
									<BudgetItem budget={budget} />
								</IonItem>
							))}
						</IonList>
					</>
				)}
				{step === 5 && (
					<>
						You're all done.  Enjoy!
						
						<p>
							However, if you'd like a few additional notes on how
							things work, keep reading.  But you can always go
							through the <em>Help</em> section later.
						</p>
						<p>
							<em>Recurring Transactions</em> and <em>Budgets</em>
							are the plan for how money from your accounts will
							be saved/spent. The <em>Trends</em> page predicts
							the amount that will be available in your accounts,
							assuming you keep to this plan.
						</p>
						<p>
							<em>Transactions</em> are the <strong>real</strong>
							record of your spending.
							<em>Recurring Transactions</em> will automatically
							create <em>Transactions</em> on the dates they occur.
						</p>
						<p>
							<em>Budgets</em> have <em>Transactions</em> filed
							against them. When making projections on
							<em>Account</em> balances, it is assumed you will
							spend the entire amount.  If more is spent than
							budgeted for a given period, that budget is ignored
							until the next period.</p><p>Of course, no plan is
							perfect.  Unexpected expenses will happen.  For those,
							one-off transactions can be made.
						</p>
					</>
				)}
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButtons slot="end">
						{step !== 1 && (
							<IonButton onClick={() => setStep(step - 1)}>
								Back
							</IonButton>
						)}
						{step !== 3 && (
							<IonButton
								fill="solid"
								color="primary"
								disabled={!canProgress}
								onClick={() => setStep(step + 1)}
							>
								Next
							</IonButton>
						)}
						{step === 4 && (
							<IonButton
								fill="solid"
								color="primary"
								disabled={!canProgress}
								onClick={goBack}
							>
								Finish
							</IonButton>
						)}
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	);
}

export default GettingStartedPage;
