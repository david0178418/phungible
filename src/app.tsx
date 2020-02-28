
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

const DailyActivityPage = lazy(() => import('./pages/daily-activity.page'));
const LoginPage = lazy(() => import('./pages/login.page'));

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
									path="/login"
									component={LoginPage}
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
