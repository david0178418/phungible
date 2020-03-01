import { useState, useEffect } from 'react';
import { getCollectionRef } from './api';

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