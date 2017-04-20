import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import TrendsContent from './trends-content';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class Trends extends Component<Props, {}> {
	public static path = '/trends/';

	public render() {
		const {store} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Trends"
					store={store}
				/>
				<ContentArea>
					<TrendsContent
						accounts={store.accounts}
						transactions={store.transactions}
						scheduledTransactions={store.scheduledTransactions}
					/>
				</ContentArea>
			</Page>
		);
	}
}
