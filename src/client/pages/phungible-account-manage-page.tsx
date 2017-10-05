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
class PhungibleAccountManagePager extends Component<Props, {}> {
	public static path = '/manage-sync';
	public static title = 'Phungible Account';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title={PhungibleAccountManagePager.title} appStore={appStore} />
				<ContentArea>
					<PhungibleAccountManager/>
				</ContentArea>
			</Page>
		);
	}
}
