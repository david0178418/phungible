import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { EventContext } from 'firebase-functions';
import { firestore } from 'firebase-admin';
import {
	ProfileCollection,
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

	const accounts =  await fs.collection(ProfileCollection.Accounts)
		.where('profileId', '==', profileId)
		.get();
	
	accounts.docs
		.map(p => p.data() as Account)
		.forEach(p => {
			batch.delete(fs.doc(`${ProfileCollection.Accounts}/${p.id}`));
		});
	
	const recurringTransactions =  await fs.collection(ProfileCollection.RecurringTransactions)
		.where('profileId', '==', profileId)
		.get();
	
	recurringTransactions.docs
		.map(p => p.data() as RecurringTransaction)
		.forEach(p => {
			batch.delete(fs.doc(`${ProfileCollection.RecurringTransactions}/${p.id}`));
		});


	const transactions =  await fs.collection(ProfileCollection.Transactions)
		.where('profileId', '==', profileId)
		.get();

	transactions.docs
		.map(p => p.data() as Transaction)
		.forEach(p => {
			batch.delete(fs.doc(`${ProfileCollection.Transactions}/${p.id}`));
		});

	
	const budgets =  await fs.collection(ProfileCollection.Budgets)
		.where('profileId', '==', profileId)
		.get();

	budgets.docs
		.map(p => p.data() as Budget)
		.forEach(p => {
			batch.delete(fs.doc(`${ProfileCollection.Budgets}/${p.id}`));
		});

	await batch.commit();


}
