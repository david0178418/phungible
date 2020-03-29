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
	formatCollection,
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
	const userMeta = useUserMetaDoc(user?.uid || '');

	useEffect(() => {
		auth().onAuthStateChanged(async newUser => {
			setUser(newUser);
			setAuthLoaded(true);
		});
	}, []);


	useEffect(() => {
		(async () => {
			if(!userMeta?.currentProfileId) {
				return;
			}

			setProfile(await getDoc(`${Collection.Profiles}/${userMeta.currentProfileId}`));

			setAccounts(
				await formatCollection<Account>(
					getCollectionRef(Collection.Accounts)
						.where('profileId', '==', userMeta.currentProfileId),
				),
			);

			setBudgets(
				await formatCollection<Budget>(
					getCollectionRef(Collection.Budgets)
						.where('profileId', '==', userMeta.currentProfileId),
				),
			);
		})();
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
