import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject} from 'mobx-react';
import * as React from 'react';

import ClearData from '../components/clear-data';
import ContentArea from '../components/shared/content-area';
import AppStore from '../stores/app';
import Page from './page';
import SettingsPage from './settings-page';

const {Component} = React;

type Props = {
	router?: Navigo;
	appStore?: AppStore;
};

@inject('appStore', 'router')
export default
class ClearDataPage extends Component<Props> {
	public static path = '/clear-data';
	public static title = 'Nuke All Data';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="horizontal">
				<AppBar
					onLeftIconButtonClick={() => this.routeBack()}
					title="Nuke All Data"
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ClearData appStore={appStore} />
				</ContentArea>
			</Page>
		);
	}

	private routeBack() {
		this.props.appStore.clearAllData();
		this.props.router.navigate(SettingsPage.path);
	}
}
