import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Component} from 'react';
import * as React from 'react';
import {getItem} from '../client/shared/storage';

import Layout from './layout';
import AppStore from './shared/stores/app';

type Props = {
	children?: any;
};

export default
class App extends Component<Props, any> {
	public static childContextTypes = {
		store: AppStore,
	};

	public store: AppStore;

	constructor(props: Props) {
		super(props);
		const data = getItem('store');

		if(data) {
			this.store = AppStore.deserialize(data);
		} else {
			this.store = new AppStore();
		}

		this.store.runTransactionSinceLastUpdate();

		// Check every 5 minutes.  Runs transactions when day rolls over
		setTimeout(() => {
			this.store.runTransactionSinceLastUpdate();
		}, 1000 * 60 * 5);
	}

	public getChildContext() {
		return {
			store: this.store,
		};
	}

	public render() {
		return (
			<MuiThemeProvider>
				<Layout>
					{this.props.children}
				</Layout>
			</MuiThemeProvider>
		);
	}
}
