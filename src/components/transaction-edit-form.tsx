import React from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
	IonTextarea,
	IonCheckbox,
	IonCard,
	IonButton,
	IonFab,
} from '@ionic/react';
import { format, parse } from 'date-fns';
import { AccountSelector } from '@components/account-selector';
import { Collection, TransactionType, Transaction } from '@shared/interfaces';
import { TransactionTypeSelector } from '@components/transaction-type-selector';
import { MoneyInput } from '@components/money-input';
import { alertController } from '@ionic/core';
import { saveDoc } from '@common/api';
import { ReceiptUploadButton } from './receipt-upload-button';
import { ExpenseCategorySelector } from './expense-category-selector';
import { BudgetSelector } from './budget-selector';

interface Props {
	transaction: Transaction;
	onUpdate(transaction: Transaction): void;
}

export
function TransactionEditForm(props: Props) {
	const {
		transaction,
		onUpdate,
	} = props;

	function updateProp<T extends keyof Transaction>(prop: T, newVal: Transaction[T]) {
		onUpdate({
			...transaction,
			[prop]: newVal,
		});
	}

	function handleTransactionTypeUpdate(type: TransactionType) {
		const fromAccountId = (type === TransactionType.Income) ?
			'' :
			transaction.fromAccountId;

		const towardAccountId = (type === TransactionType.Expense) ?
			'' :
			transaction.towardAccountId;
		
		const expenseCategory = (type !== TransactionType.Expense) ?
			null:
			transaction.expenseCategory;

		onUpdate({
			...transaction,
			type,
			expenseCategory,
			towardAccountId,
			fromAccountId,
		});
	}

	async function removeImage(imageIndex: number) {
		const alert = await alertController.create({
			header: 'Delete Receipt',
			message: 'Permanently delete receipt?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
				}, {
					text: 'Delete',
					async handler() {
						alert.dismiss();
						const receiptUrls = transaction
								.receiptUrls
								.filter((url, i) => i !== imageIndex);
						await saveDoc<Transaction>({
								...transaction,
								receiptUrls,
							},
							Collection.Transactions,
						);

						updateProp('receiptUrls', receiptUrls);
					},
				},
			],
		});

		alert.present();
	}

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Name
							</IonLabel>
							<IonInput
								value={transaction.name}
								onIonChange={({detail}) => {
									typeof detail.value === 'string' &&
									updateProp('name', detail.value);
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<MoneyInput
							amount={transaction.amount}
							onUpdate={(amount) => updateProp('amount', amount)}
						/>
					</IonCol>
				</IonRow>
			
				{!transaction.parentBudgetId && (
					<IonRow>
						<IonCol>
							<TransactionTypeSelector
								type={transaction.type}
								onSelect={handleTransactionTypeUpdate}
							/>
						</IonCol>
					</IonRow>
				)}

				{transaction.type === TransactionType.Expense && (
					<IonRow>
						<IonCol>
							<ExpenseCategorySelector
								label="Expense Category"
								value={transaction.expenseCategory}
								onChange={expenseCategory => updateProp('expenseCategory', expenseCategory)}
							/>
						</IonCol>
					</IonRow>
				)}

				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel>
								Pending
							</IonLabel>
							<IonCheckbox
								slot="start"
								checked={transaction.pending}
								onIonChange={({detail}) => updateProp('pending', detail.checked)}
							/>
						</IonItem>
						<IonItem>
							<IonLabel position="stacked">
								Date
							</IonLabel>
							<IonInput
								type="date"
								value={format(new Date(transaction.date), 'yyyy-MM-dd')}
								onIonChange={({detail}) => {
									if(typeof detail.value === 'string') {
										detail.value && updateProp('date', parse(detail.value, 'yyyy-MM-dd', new Date()).toISOString());
									}
								}}
							/>
						</IonItem>
					</IonCol>
				</IonRow>
				
				{transaction.type !== TransactionType.Income && (
					<IonRow>
						<IonCol>
							<AccountSelector
								label="From Account"
								value={transaction.fromAccountId}
								onChange={account => updateProp('fromAccountId', account)}
							/>
						</IonCol>
					</IonRow>
				)}

				{transaction.type !== TransactionType.Expense && (
					<IonRow>
						<IonCol>
							<AccountSelector
								label="Toward Account"
								value={transaction.towardAccountId}
								onChange={account => updateProp('towardAccountId', account)}
							/>
						</IonCol>
					</IonRow>
				)}

				{transaction.type === TransactionType.Expense && (
					<BudgetSelector
						value={transaction.parentBudgetId}
						onChange={budget => updateProp('parentBudgetId', budget)}
					/>
				)}

				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Notes
							</IonLabel>
							<IonTextarea
								value={transaction.notes}
								onIonChange={({detail}) => updateProp('notes', detail.value || '')}
							/>
						</IonItem>
					</IonCol>
				</IonRow>

				{transaction.receiptUrls.map((url, i) => (
					<IonCard key={i} >
						<img src={url} />
						<IonButton expand="full" color="danger" onClick={() => removeImage(i)}>
							Delete
						</IonButton>
					</IonCard>
				))}
			</IonGrid>

			<IonFab
				edge
				vertical="top"
				horizontal="end"
				slot="fixed"
			>
				<ReceiptUploadButton
					expandDown
					transaction={transaction}
					onUpload={(receiptUrls) => updateProp('receiptUrls', receiptUrls)}
				/>
			</IonFab>
		</>
	);
}

