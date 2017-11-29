import {inject} from 'mobx-react';
import * as React from 'react';

import PhungibleAccountManager from '../components/phungible-account-manager';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

const { Component } = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class PhungibleAccountManagePage extends Component<Props, {}> {
	public static path = '/manage-sync';
	public static title = 'Sign in';

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title={PhungibleAccountManagePage.title} appStore={appStore} />
				<ContentArea>
					<PhungibleAccountManager/>
				</ContentArea>
			</Page>
		);
	}
}
