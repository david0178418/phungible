import { useState, useEffect, useContext } from 'react';
import { getCollectionRef } from './api';
import { tuple } from './utils';
import equal from 'fast-deep-equal';
import { ProfileContext } from './contexts';

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
	const profile = useContext(ProfileContext);


	useEffect(() => {
		if(!profile) {
			return;
		}

		const unsub = getCollectionRef(path)
			.where('profileId', '==', profile?.id)
			.orderBy('date', 'desc')
			.onSnapshot(snap =>
				setCollection(
					snap.docs.map(doc =>
						doc.data() as T,
					),
				),
			);

		return unsub;
	},
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[profile]);

	return collection;
}

export
function useEditItem<T>(item: T | (() => T), validationFn: (item: T) => boolean) {
	const [original, setOriginal] = useState(item);
	const [
		editedItem,
		setItem,
	] = useState(item);
	const [isValid, setIsValid] = useState(false);
	const [hasChanged, setHasChanged] = useState(false);

	useEffect(() => {
		setHasChanged(!equal(editedItem, original));
	}, [editedItem, original]);

	useEffect(() => {
		setIsValid(hasChanged && validationFn(editedItem));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, editedItem]);

	function resetItem(updatedItem: T) {
		setItem(updatedItem);
		setOriginal(updatedItem);
	}

	return tuple(
		editedItem,
		setItem,
		resetItem,
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
