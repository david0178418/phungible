import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { EventContext } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import {
	Collection,
	RecurringTransaction,
	Account,
	Transaction,
	Budget,
} from '../shared/interfaces';

export
async function handleProfileDelete(snapshot: DocumentSnapshot, context: EventContext) {
	const {
		profileId = '',
	} = context.params;
	console.log(`Deleteing profile '${profileId}'.`);
	const fs = firestore();
	const batch = fs.batch();

	const accounts =  await fs.collection(Collection.Accounts)
		.where('profileId', '==', profileId)
		.get();
	
	accounts.docs
		.map(p => p.data() as Account)
		.forEach(p => {
			batch.delete(fs.doc(`${Collection.Accounts}/${p.id}`));
		});
	
	const recurringTransactions =  await fs.collection(Collection.RecurringTransactions)
		.where('profileId', '==', profileId)
		.get();
	
	recurringTransactions.docs
		.map(p => p.data() as RecurringTransaction)
		.forEach(p => {
			batch.delete(fs.doc(`${Collection.RecurringTransactions}/${p.id}`));
		});


	const transactions =  await fs.collection(Collection.Transactions)
		.where('profileId', '==', profileId)
		.get();

	transactions.docs
		.map(p => p.data() as Transaction)
		.forEach(p => {
			batch.delete(fs.doc(`${Collection.Transactions}/${p.id}`));
		});

	
	const budgets =  await fs.collection(Collection.Budgets)
		.where('profileId', '==', profileId)
		.get();

	budgets.docs
		.map(p => p.data() as Budget)
		.forEach(p => {
			batch.delete(fs.doc(`${Collection.Budgets}/${p.id}`));
		});

	await batch.commit();


}
