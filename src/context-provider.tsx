import React, { ReactNode, useState, useEffect } from 'react';
import { auth, User } from 'firebase/app';

import {
	UserContext,
	AccountsContext,
	ProfileContext,
	UserMetaContext,
	BudgetContext,
	ActiveProfileSetterContext,
} from '@common/contexts';
import {
	Account,
	Collection,
	Profile,
	Budget,
	RecurringTransaction,
} from '@shared/interfaces';
import {
	getCollectionRef,
	getDoc,
	saveDoc,
	getBatch,
	getDocRef,
	getCollectionId,
} from '@common/api';
import { useUserMetaDoc } from '@common/hooks';
import { occurrancesInRange } from '@common/occurrence-fns';
import { createTransactionFromRecurringTransaction } from '@shared/create-docs';

const LAST_PROFILE_ID_KEY = 'LAST_ACTIVE_PROFILE_ID';

// TODO Find a place for this
async function foo(profile: Profile) {
	const now = (new Date()).toISOString();
	const lastUpdated = profile.lastProcessing || profile.date;

	const rtsSnap = await getCollectionRef(Collection.RecurringTransactions)
		.where('profileId', '==', profile.id)
		.get();

	const transactions = rtsSnap.docs
		.map(doc => doc.data() as RecurringTransaction)
		.map(rt =>
			occurrancesInRange(
				rt,
				lastUpdated > rt.date ?
					lastUpdated :
					rt.date,
				now,
			)
			.map(date => createTransactionFromRecurringTransaction(date, rt)),
		)
		.flat();

	if(transactions.length) {
		const batch = getBatch();

		transactions.forEach(t => {
			const id = getCollectionId(Collection.Transactions);
			batch.set(getDocRef(`${Collection.Transactions}/${id}`), {
				...t,
				id,
			});
		});

		batch.set(getDocRef(`${Collection.Profiles}/${profile.id}`), {
			...profile,
			lastProcessing: now,
		});

		batch.commit();
	}
	
	console.log('new transactions', transactions);

	// Every hour
}

interface Props {
	children: ReactNode;
}

export
function ContextProvider(props: Props) {
	const [authLoaded, setAuthLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [activeProfileId, setActiveProfileId] = useState('');
	const [profile, setProfile] = useState<Profile | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const userMeta = useUserMetaDoc(user?.uid || '');
	const [unsubs, setUnsubs] = useState<Array<() => void>>([]);
	const [intervalId, setIntervalId] = useState(0);

	useEffect(() => {
		setActiveProfileId(localStorage.getItem(LAST_PROFILE_ID_KEY) || '');

		auth().onAuthStateChanged(async newUser => {
			if(newUser) {
				setUser(newUser);
			} else {
				setUser(null);
				setAuthLoaded(true);
				clearActiveProfile();
			}
		});
	}, []);

	useEffect(() => {
		// TODO Needs rework? Assumes profile will
		// be loaded if a user is present.
		if(profile) {
			setAuthLoaded(true);

			intervalId && clearInterval(intervalId);
			foo(profile);
			setIntervalId(
				window.setInterval(() => foo(profile), 60 * 60 * 1000),
			);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	useEffect(() => {
		if(!userMeta?.lastOpenProfile) {
			clearActiveProfile();
			return;
		}

		if(profile) {
			return;
		}

		setActiveProfileId(userMeta.lastOpenProfile);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userMeta]);

	useEffect(() => {
		(async () => {
			unsubs.map(u => u());

			if(!activeProfileId) {
				setAccounts([]);
				setBudgets([]);
				setProfile(null);
				return;
			}

			localStorage.setItem(LAST_PROFILE_ID_KEY, activeProfileId);
			setProfile(await getDoc(`${Collection.Profiles}/${activeProfileId}`));

			if(userMeta && userMeta.lastOpenProfile !== activeProfileId) {
				saveDoc({
					...userMeta,
					lastOpenProfile: activeProfileId,
				}, Collection.UserMetas);
			}

			const accountsUnsub = getCollectionRef(Collection.Accounts)
				.where('profileId', '==', activeProfileId)
				.orderBy('date', 'desc')
				.onSnapshot(snap => {
					setAccounts(
						snap.docs.map(doc =>
							doc.data() as Account,
						),
					);
				});

			const budgetsUnsub = getCollectionRef(Collection.Budgets)
				.where('profileId', '==', activeProfileId)
				.orderBy('date', 'desc')
				.onSnapshot(snap => {
					setBudgets(
						snap.docs.map(doc =>
							doc.data() as Budget,
						),
					);
				});
			
			setUnsubs([
				accountsUnsub,
				budgetsUnsub,
			]);
			
			return () => {
				unsubs.map(u => u());
			};
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeProfileId]);

	if(!authLoaded) {
		return null;
	}

	function clearActiveProfile() {
		localStorage.removeItem(LAST_PROFILE_ID_KEY);
		setActiveProfileId('');
	}

	return (
		<>
			<AccountsContext.Provider value={accounts}>
				<BudgetContext.Provider value={budgets}>
					<UserContext.Provider value={user}>
						<UserMetaContext.Provider value={userMeta}>
							<ProfileContext.Provider value={profile}>
								<ActiveProfileSetterContext.Provider value={setActiveProfileId}>
									{props.children}
								</ActiveProfileSetterContext.Provider>
							</ProfileContext.Provider>
						</UserMetaContext.Provider>
					</UserContext.Provider>
				</BudgetContext.Provider>
			</AccountsContext.Provider>
		</>
	);
}
