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
} from '@common/interfaces';
import {
	getCollectionRef,
	getDoc,
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
	const [subs, setSubs] = useState<Array<() => void>>([]);
	const userMeta = useUserMetaDoc(user?.uid || '');

	useEffect(() => {
		setActiveProfileId(localStorage.getItem(LAST_PROFILE_ID_KEY) || '');

		auth().onAuthStateChanged(async newUser => {
			if(newUser) {
				setUser(newUser);
			} else {
				setUser(null);
			}
			setAuthLoaded(true);
		});
	}, []);

	useEffect(() => {
		if(!userMeta?.lastOpenProfile) {
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
			subs.map(sub => sub());

			if(!activeProfileId) {
				setAccounts([]);
				setBudgets([]);
				setProfile(null);
				return;
			}

			localStorage.setItem(LAST_PROFILE_ID_KEY, activeProfileId);
			setProfile(await getDoc(`${Collection.Profiles}/${activeProfileId}`));

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
			
			setSubs([
				accountsUnsub,
				budgetsUnsub,
			]);
			
			return () => {
				accountsUnsub();
				budgetsUnsub();
			};
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeProfileId]);

	if(!authLoaded) {
		return null;
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
