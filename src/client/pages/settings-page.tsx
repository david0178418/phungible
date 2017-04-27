import * as React from 'react';
import {Component} from 'react';

import Settings from '../components/settings';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class SettingsPage extends Component<Props, {}> {
	public static path = '/settings';
	public static title = 'Settings';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {store} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title={SettingsPage.title} store={store} />
				<ContentArea>
					<Settings store={store} />
				</ContentArea>
			</Page>
		);
	}
}
