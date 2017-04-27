import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import * as React from 'react';
import {Component} from 'react';

import ClearDataPage from '../../pages/clear-data-page';
import AppStore from '../../stores/app';

type Props = {
	store?: AppStore;
};

export default
class Settings extends Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<List>
				<ListItem
					primaryText="Nuke all data"
					rightIcon={<WarningIcon color="red"/>}
					href={`#${ClearDataPage.path}`}
				/>
			</List>
		);
	}
}
