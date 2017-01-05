import {Component} from 'react';
import * as React from 'react';

import Layout from './layout';

import './app.scss';
import {AppStore} from './global/types';

export default
class App extends Component<any, any> {
	public store: AppStore;

	constructor(props: {}) {
		super(props);

		this.store = new AppStore();
	}

	public render() {
		return (
			<Layout>
				{React.cloneElement(this.props.children, {
					store: this.store,
				})}
			</Layout>
		);
	}
}
