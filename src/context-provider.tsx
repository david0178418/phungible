import React, { ReactNode, useState, useEffect } from 'react';
import { User } from 'firebase/app';

import {
	UserContext,
	AccountsContext,
	ProfileContext,
	UserMetaContext,
	BudgetContext,
	ActiveProfileSetterContext,
	RefreshActiveProfileContext,
} from '@common/contexts';
import {
	Account,
	Collection,
	Profile,
	Budget,
} from '@shared/interfaces';
import {
	getDoc,
	saveDoc,
	getCollectionRef,
	runRecurringTransactionCheck,
} from '@common/api';
import { useUserMetaDoc } from '@common/hooks';

const LAST_PROFILE_ID_KEY = 'LAST_ACTIVE_PROFILE_ID';

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

		import('@common/side-effect-modules').then(({a}) => {
			a().onAuthStateChanged(async newUser => {
				if(newUser) {
					setUser(newUser);
				} else {
					setUser(null);
					setAuthLoaded(true);
					clearActiveProfile();
				}
			});
		});
	}, []);

	useEffect(() => {
		// TODO Needs rework? Assumes profile will
		// be loaded if a user is present.
		if(profile) {
			setAuthLoaded(true);

			intervalId && clearInterval(intervalId);
			runRecurringTransactionCheck(profile);
			setIntervalId(
				window.setInterval(
					() => runRecurringTransactionCheck(profile),
					// Every hour
					60 * 60 * 1000,
				),
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
			await refreshActiveProfile();

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

	async function refreshActiveProfile() {
		setProfile(await getDoc(`${Collection.Profiles}/${activeProfileId}`));
	}

	return (
		<>
			<AccountsContext.Provider value={accounts}>
				<BudgetContext.Provider value={budgets}>
					<UserContext.Provider value={user}>
						<UserMetaContext.Provider value={userMeta}>
							<ProfileContext.Provider value={profile}>
								<RefreshActiveProfileContext.Provider value={refreshActiveProfile}>
									<ActiveProfileSetterContext.Provider value={setActiveProfileId}>
										{props.children}
									</ActiveProfileSetterContext.Provider>
								</RefreshActiveProfileContext.Provider>
							</ProfileContext.Provider>
						</UserMetaContext.Provider>
					</UserContext.Provider>
				</BudgetContext.Provider>
			</AccountsContext.Provider>
		</>
	);
}
