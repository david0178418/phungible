import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import Layout from './layout';

import './app.scss';
import {BudgetItem} from './global/types';

export
class AppStore {
	@observable public budgetItems: BudgetItem[];
}

@observer
export default
class App extends Component<any, any> {
	public store: AppStore;

	constructor(props: {}) {
		super(props);

		this.store = new AppStore();
	}

	public render() {
		const {
		} = this.store;

		return (
			<Layout>
				{this.props.children}
			</Layout>
		);
	}
}
