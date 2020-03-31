import React, { ReactNode, useState, useEffect } from 'react';
import { auth, User } from 'firebase/app';

import {
	UserContext,
	AccountsContext,
	ProfileContext,
	UserMetaContext,
	BudgetContext,
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

interface Props {
	children: ReactNode;
}

export
function ContextProvider(props: Props) {
	const [authLoaded, setAuthLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [subs, setSubs] = useState<Array<() => void>>([]);
	const userMeta = useUserMetaDoc(user?.uid || '');

	useEffect(() => {
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
		(async () => {
			subs.map(sub => sub());

			if(!userMeta?.currentProfileId) {
				setAccounts([]);
				setBudgets([]);
				setProfile(null);
				return;
			}

			setProfile(await getDoc(`${Collection.Profiles}/${userMeta.currentProfileId}`));

			const accountsUnsub = getCollectionRef(Collection.Accounts)
				.where('profileId', '==', userMeta.currentProfileId)

				.orderBy('date', 'desc')
				.onSnapshot(snap => {
					setAccounts(
						snap.docs.map(doc =>
							doc.data() as Account,
						),
					);
				});

			const budgetsUnsub = getCollectionRef(Collection.Budgets)
				.where('profileId', '==', userMeta.currentProfileId)
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
	}, [userMeta]);

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
								{props.children}
							</ProfileContext.Provider>
						</UserMetaContext.Provider>
					</UserContext.Provider>
				</BudgetContext.Provider>
			</AccountsContext.Provider>
		</>
	);
}
