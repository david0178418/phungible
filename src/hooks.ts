import { useState, useEffect } from 'react';
import { getCollectionRef } from './api';
import { tuple } from './utils';

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
