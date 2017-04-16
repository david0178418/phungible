import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import ContentArea from '../shared/content-area';
import HomeContent from './home-content';

type Props = {
	store: AppStore;
};

export default
class Index extends Component<Props, any> {
	public render() {
		const {store} = this.props;
		return (
			<div>
				<Navigation title="Home" store={store} />
				<ContentArea>
					<HomeContent store={store} />
				</ContentArea>
			</div>
		);
	}
}
