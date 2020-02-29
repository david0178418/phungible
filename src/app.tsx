
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
import { UserContext } from './contexts';
import { Menu } from './components/menu';
import { IonReactRouter } from '@ionic/react-router';

import './config';
import './global.scss';

import { Route } from 'react-router-dom';

const AccountsPage = lazy(() => import('./pages/accounts.page'));
const BudgetsPage = lazy(() => import('./pages/budgets.page'));
const DailyActivityPage = lazy(() => import('./pages/daily-activity.page'));
const HelpPage = lazy(() => import('./pages/help.page'));
const LoginPage = lazy(() => import('./pages/login.page'));
const RecurringTransactions = lazy(() => import('./pages/recurring-transactions.page'));
const SettingsPage = lazy(() => import('./pages/settings.page'));
const TrendsPage = lazy(() => import('./pages/trends.page'));
const WelcomePage = lazy(() => import('./pages/welcome.page'));

export
function App() {
	const [authLoaded, setAuthLoaded] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		auth().onAuthStateChanged(newUser => {
			setUser(newUser);
			setAuthLoaded(true);
		});
	}, []);

	if(!authLoaded) {
		return null;
	}

	return (
		<IonApp>
			<IonReactRouter>
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
									path="/budgets"
									component={BudgetsPage}
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
									path="/settings"
									component={SettingsPage}
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
			</IonReactRouter>
		</IonApp>
	);
}
