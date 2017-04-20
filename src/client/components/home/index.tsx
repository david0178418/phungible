import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import HomeContent from './home-content';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class Index extends Component<Props, {}> {
	public static path = '/';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {store} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title="Home" store={store} />
				<ContentArea>
					<HomeContent store={store} />
				</ContentArea>
			</Page>
		);
	}
}
