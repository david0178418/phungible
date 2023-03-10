import {inject} from 'mobx-react';
import * as React from 'react';

import Home from '../components/home';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class SummaryPage extends Component<Props> {
	public static path = '/summary';
	public static title = 'Summary';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title="Phungible - Welcome!" appStore={appStore} />
				<ContentArea>
					<Home appStore={appStore} />
				</ContentArea>
			</Page>
		);
	}
}
