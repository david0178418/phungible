import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import TrendsContent from './trends-content';

type Context = {
	store: AppStore;
};

type Props = {
	disableAnimation: boolean;
};

export default
class Trends extends Component<Props, {}> {
	public static path = '/trends/';
	public static contextTypes = {
		store: () => false,
	};
	public context: Context;

	public render() {
		const {store} = this.context;
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
