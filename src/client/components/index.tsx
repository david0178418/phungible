import * as React from 'react';

import Navigation from '../layout/navigation';
import AppStore from '../shared/stores/app';
import Trends from './trends';

type Props = {
	store: AppStore;
};

export default
function Index({store}: Props) {
	return (
		<div>
			<Navigation
				title="Trends"
				store={store}
			/>
			<Trends
				accounts={store.accounts}
				transactions={store.transactions}
				scheduledTransactions={store.scheduledTransactions}
			/>
		</div>
	);
}
