
import React, {
	// Suspense,
	useState,
	useEffect,
	lazy,
	Suspense,
} from 'react';
import {
	IonApp,
	// IonLoading,
	IonRouterOutlet,
	IonSplitPane,
	IonLoading,
} from '@ionic/react';
import { auth, User } from 'firebase/app';
import { UserContext, AccountsContext } from './contexts';
import { Menu } from './components/menu';
import { IonReactRouter } from '@ionic/react-router';

import './config';
import './global.scss';

import { Route } from 'react-router-dom';
import { Account, Collection } from './interfaces';
import { getCollectionRef } from './api';

interface ComponentImport {
    default: () => JSX.Element;
}
type ComponentFactory = () => Promise<ComponentImport>;
type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

function prefetchFn(timing: number) {
	const prefetchList: ComponentFactory[] = [];

	setTimeout(async () => {
		for(let component of prefetchList) {
			await component();
		}
	}, timing);

	return (componentImport: ComponentFactory): LazyComponent => {
		prefetchList.push(componentImport);
		return lazy(componentImport);
	};
}

const prefetch = prefetchFn(5000);

const AccountsPage = prefetch(() => import('./pages/accounts.page'));
const AccountEditPage = prefetch(() => import('./pages/account-edit.page'));
const BudgetsPage = prefetch(() => import('./pages/budgets.page'));
const BudgetEditPage = prefetch(() => import('./pages/budget-edit.page'));
const DailyActivityPage = prefetch(() => import('./pages/daily-activity.page'));
const RecurringTransactions = prefetch(() => import('./pages/recurring-transactions.page'));
const RecurringTransactionEdit = prefetch(() => import('./pages/recurring-transaction-edit.page'));
const SettingsPage = prefetch(() => import('./pages/settings.page'));
const TransactionsPage = prefetch(() => import('./pages/transactions.page'));
const TransactionEditPage = prefetch(() => import('./pages/transaction-edit.page'));
const TrendsPage = prefetch(() => import('./pages/trends.page'));
const WelcomePage = prefetch(() => import('./pages/welcome.page'));
const HelpPage = prefetch(() => import('./pages/help.page'));
const LoginPage = prefetch(() => import('./pages/login.page'));

export
function App() {
	const [authLoaded, setAuthLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);

	useEffect(() => {
		auth().onAuthStateChanged(newUser => {
			setUser(newUser);
			setAuthLoaded(true);
		});
		getCollectionRef(Collection.Accounts)
			.get()
			.then(collection => {
				setAccounts(collection.docs.map(y => y.data() as Account));
			});
			
	}, []);

	if(!authLoaded) {
		return null;
	}

	return (
		<IonApp>
			<IonReactRouter>
				<AccountsContext.Provider value={accounts}>
					<UserContext.Provider value={user}>
						<IonSplitPane contentId="main">
							<Menu />
							<Suspense fallback={<IonLoading isOpen />}>
								<IonRouterOutlet id="main">
									<Route
										path="/accounts"
										component={AccountsPage}
									/>
									<Route
										path="/account/:id?"
										component={AccountEditPage}
									/>
									<Route
										path="/budgets"
										component={BudgetsPage}
									/>
									<Route
										path="/budget/:id?"
										component={BudgetEditPage}
									/>
									<Route
										path="/help"
										component={HelpPage}
									/>
									<Route
										path="/login"
										component={LoginPage}
									/>
									<Route
										path="/recurring-transactions"
										component={RecurringTransactions}
									/>
									<Route
										path="/recurring-transaction/:id?"
										component={RecurringTransactionEdit}
									/>
									<Route
										path="/settings"
										component={SettingsPage}
									/>
									<Route
										path="/transactions"
										component={TransactionsPage}
									/>
									<Route
										path="/transaction/:id?"
										component={TransactionEditPage}
									/>
									<Route
										path="/trends"
										component={TrendsPage}
									/>
									<Route
										path="/welcome"
										component={WelcomePage}
									/>
									<Route
										exact
										path="/"
										component={DailyActivityPage}
									/>
								</IonRouterOutlet>
							</Suspense>
						</IonSplitPane>
					</UserContext.Provider>
				</AccountsContext.Provider>
			</IonReactRouter>
		</IonApp>
	);
}
