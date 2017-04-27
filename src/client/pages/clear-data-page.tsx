import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import * as React from 'react';
import {Component} from 'react';

import ClearData from '../components/clear-data';
import ContentArea from '../components/shared/content-area';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	store?: AppStore;
};

export default
class ClearDataPage extends Component<Props, {}> {
	public static path = '/clear-data';
	public static title = 'Nuke All Data';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {store} = this.props;
		return (
			<Page className="slide-horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => window.history.back()}
					title="Nuke All Data"
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ClearData store={store} />
				</ContentArea>
			</Page>
		);
	}
}
