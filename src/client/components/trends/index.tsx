import * as React from 'react';
import {Component} from 'react';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import ContentArea from '../shared/content-area';
import TrendsContent from './trends-content';

type Props = {
	store: AppStore;
};

export default
class Trends extends Component<Props, any> {
	public render() {
		const {store} = this.props;
		return (
			<div>
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
			</div>
		);
	}
}
