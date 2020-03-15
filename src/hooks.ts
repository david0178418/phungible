import { useState, useEffect } from 'react';
import { getCollectionRef } from './api';
import { tuple } from './utils';
import { Transaction, TransactionType } from './interfaces';
import equal from 'fast-deep-equal';

export
function useStatePropSetter<T>(createFn: T | (() => T)) {
	const [obj, setObj] = useState(createFn);

	function setProp<U extends keyof T>(prop: U, value: T[U]) {
		setObj({
			...obj,
			[prop]: value,
		});
	}

	return tuple(
		obj,
		setObj,
		setProp,
	);
}

export
function useCollection<T>(path: string) {
	const [collection, setCollection] = useState<T[]>([]);

	useEffect(() => (
		getCollectionRef(path)
			// .where('ownerId', '==', user?.uid)
			.onSnapshot(snap =>
				setCollection(
					snap.docs.map(doc =>
						doc.data() as T,
					),
				),
			)
	),
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[]);

	return collection;
}

// TODO Should this go somewhere else
function canSaveTransation(transaction: Transaction) {
	const {
		amount,
		fromAccountId,
		towardAccountId,
		type,
		name,
		date,
	} = transaction;

	return !!(
		amount &&
		name &&
		date && (
			fromAccountId || (
				type === TransactionType.Income
			)
		) && (
			towardAccountId || (
				type === TransactionType.Expense
			)
		)
	);
}

export
function useTransactionEdit(transaction: Transaction | (() => Transaction)) {
	const [original, setOriginal] = useState(transaction);
	const [
		editedTransaction,
		setTransaction,
	] = useState(transaction);
	const [isValid, setIsValid] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		setHasChanged(!equal(editedTransaction, original));
	}, [editedTransaction, original]);

	useEffect(() => {
		setIsValid(hasChanged && canSaveTransation(editedTransaction));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, editedTransaction]);

	function resetTransaction(updatedTransaction: Transaction) {
		setTransaction(updatedTransaction);
		setOriginal(updatedTransaction);
	}

	return tuple(
		editedTransaction,
		setTransaction,
		resetTransaction,
		isValid,
	);
}

// TODO Does this work for dynamic colletion subs after page nav?
// export
// function useTransactionsByDate(date: string) {
// 	const unsub = useRef<() => any>(() => null);
// 	const [transactions, settransactions] = useState<Transaction[]>([]);

// 	useEffect(() => {
// 		unsub.current();
// 		unsub.current = getCollectionRef(Collection.Transactions)
// 			.where('date', '>', startOfDay(new Date(date)).toISOString())
// 			.where('date', '<', endOfDay(new Date(date)).toISOString())
// 			.onSnapshot(snap =>
// 				settransactions(
// 					snap.docs.map(doc =>
// 						doc.data() as Transaction,
// 					),
// 				),
// 			);
// 	}, [date]);

// 	return transactions;
// }
