import {inject} from 'mobx-react';
import * as React from 'react';

import Help from '../components/help';
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
class HelpPage extends Component<Props> {
	public static path = '/help';
	public static title = 'Help';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title="Help" appStore={appStore} />
				<ContentArea>
					<Help />
				</ContentArea>
			</Page>
		);
	}
}
