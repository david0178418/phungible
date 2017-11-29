import {inject} from 'mobx-react';
import * as React from 'react';

import ProfileManager from '../components/profile-manager';
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
class ProfileManagerPage extends Component<Props, {}> {
	public static path = '/manage-profiles';
	public static title = 'Profiles';

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title={ProfileManagerPage.title} appStore={appStore} />
				<ContentArea>
					<ProfileManager/>
				</ContentArea>
			</Page>
		);
	}
}
