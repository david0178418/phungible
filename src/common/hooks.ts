import { useState, useEffect, useContext } from 'react';
import { getCollectionRef, getDocRef } from './api';
import { tuple } from './utils';
import equal from 'fast-deep-equal';
import { ProfileContext, UserContext } from './contexts';
import { Collection, UserMeta, ProfileDocs, Profile } from '@shared/interfaces';

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
function useProfileDocCollection<T extends ProfileDocs>(path: string) {
	const [collection, setCollection] = useState<T[]>([]);
	const profile = useContext(ProfileContext);
	const [unsub, setUnsub] = useState<() => void>(() => () => null);

	useEffect(() => {
		unsub();

		if(!profile) {
			return;
		}

		const newUnsubFn = getCollectionRef(path)
			.where('profileId', '==', profile?.id)
			.orderBy('date', 'desc')
			.onSnapshot(snap => {
				setCollection(
					snap.docs.map(doc =>
						doc.data() as T,
					),
				);
			});

		setUnsub(() => newUnsubFn);

		return () => {
			unsub();
		};
	},
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[profile]);

	return collection;
}

export
function useProfileCollection() {
	const [ownedProfiles, setOwnedProfiles] = useState<Profile[]>([]);
	const [sharedProfiles, setSharedProfiles] = useState<Profile[]>([]);
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [unsubs, setUnsubs] = useState<Array<() => void>>([]);
	const user = useContext(UserContext);

	useEffect(() => {
		unsubs.map(u => u());

		if(!user) {
			return;
		}

		const unsubOwned = getCollectionRef(Collection.Profiles)
			.where('ownerId', '==', user?.uid)
			.onSnapshot(snap => {
				setOwnedProfiles(
					snap.docs.map(doc =>
						doc.data() as Profile,
					),
				);
			});

		const unsubShared = getCollectionRef(Collection.Profiles)
			.where(`sharedUsers.${user?.uid}.username`, '==', user?.displayName)
			.onSnapshot(snap => {
				setSharedProfiles(
					snap.docs.map(doc =>
						doc.data() as Profile,
					),
				);
			});

		setUnsubs([
			unsubOwned,
			unsubShared,
		]);

		return () => {
			unsubs.map(u => u());
		};
	},
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[user]);

	useEffect(() => {
		setProfiles(ownedProfiles.concat(sharedProfiles));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ownedProfiles, sharedProfiles]);

	return profiles;
}

export
function useUserMetaDoc(userId: string) {
	const [userMeta, setUserMeta] = useState<UserMeta | null>(null);
	const [unsub, setUnsub] = useState<() => void>(() => () => null);

	useEffect(() => {
		unsub();

		if(!userId) {
			setUserMeta(null);
			return;
		}

		const newUnsubFn = getDocRef(`${Collection.UserMetas}/${userId}`)
			.onSnapshot(snap => {
				setUserMeta(
					snap.data() as UserMeta,
				);
			});

		setUnsub(() => newUnsubFn);

		return () => {
			unsub();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	return userMeta;
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
