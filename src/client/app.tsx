import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Component} from 'react';
import * as React from 'react';
import {getItem} from '../client/shared/storage';

import Layout from './layout';

import './app.scss';
import AppStore from './shared/stores/app';

export default
class App extends Component<any, any> {
	public store: AppStore;

	constructor(props: {}) {
		super(props);
		const data = getItem('store');

		if(data) {
			this.store = AppStore.deserialize(data);
		} else {
			this.store = new AppStore();
		}
	}

	public render() {
		return (
			<MuiThemeProvider>
				<Layout>
					{React.cloneElement(this.props.children, {
						store: this.store,
					})}
				</Layout>
			</MuiThemeProvider>
		);
	}
}
