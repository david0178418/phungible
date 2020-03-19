
import React, { useState } from 'react';
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
	const [paneDisabled, setPaneDisabled] = useState(false);

	return (
		<ContextProvider>
			<IonApp>
				<IonReactRouter>
					<IonSplitPane
						contentId="main"
						disabled={paneDisabled}
					>
						<Menu />
						<Routes onPathChange={setPaneDisabled} />
					</IonSplitPane>
				</IonReactRouter>
			</IonApp>
		</ContextProvider>
	);
}
