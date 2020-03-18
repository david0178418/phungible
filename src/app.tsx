
import React from 'react';
import {
	IonApp,
	IonSplitPane,
} from '@ionic/react';
import { Menu } from './components/menu';
import { IonReactRouter } from '@ionic/react-router';

import './config';
import './global.scss';

import { ContextProvider } from './context-provider';
import { Routes } from './routes';

export
function App() {
	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main">
					<ContextProvider>
						<Menu />
						<Routes />
					</ContextProvider>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	);
}
