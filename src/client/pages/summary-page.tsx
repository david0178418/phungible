import * as React from 'react';
import {Component} from 'react';

import Home from '../components/home';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class SummaryPage extends Component<Props, {}> {
	public static path = '/summary';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {store} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title="Phungible - Welcome!" store={store} />
				<ContentArea>
					<Home store={store} />
				</ContentArea>
			</Page>
		);
	}
}
