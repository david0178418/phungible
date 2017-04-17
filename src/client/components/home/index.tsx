import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import HomeContent from './home-content';

type Context = {
	store: AppStore;
};

export default
class Index extends Component<{}, {}> {
	public static contextTypes = {
		store: () => false,
	};
	public static path = '/';
	public context: Context;

	public render() {
		const {store} = this.context;
		return (
			<Page>
				<Navigation title="Home" store={store} />
				<ContentArea>
					<HomeContent store={store} />
				</ContentArea>
			</Page>
		);
	}
}
