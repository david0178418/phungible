import {inject} from 'mobx-react';
import * as React from 'react';

import ContentArea from '../components/shared/content-area';
import Trends from '../components/trends';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class TrendsPage extends Component<Props> {
	public static path = '/trends/';
	public static title = 'Trends';

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation
					title="Trends"
					appStore={appStore}
				/>
				<ContentArea>
					<Trends
						accounts={(appStore.currentProfile.accounts as any).toJS()}
						budgets={(appStore.currentProfile.budgets as any).toJS()}
						transactions={(appStore.currentProfile.transactions as any).toJS()}
						scheduledTransactions={(appStore.currentProfile.scheduledTransactions as any).toJS()}
					/>
				</ContentArea>
			</Page>
		);
	}
}
