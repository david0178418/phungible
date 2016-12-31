import 'bootstrap/dist/css/bootstrap.min.css';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import './app.less';

export
class AppStore {
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
			<div>
				Hello world
			</div>
		);
	}
}
