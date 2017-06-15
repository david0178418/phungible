import {inject} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import GettingStarted from '../components/getting-started';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class GettingStartedPage extends Component<Props, {}> {
	public static path = '/getting-started';
	public static title = 'Getting Started';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page className="slide-vertical">
				<Navigation title={GettingStartedPage.title} appStore={appStore} />
				<ContentArea>
					<GettingStarted />
				</ContentArea>
			</Page>
		);
	}
}
