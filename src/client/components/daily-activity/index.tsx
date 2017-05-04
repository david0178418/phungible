import {Tab, Tabs} from 'material-ui/Tabs';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import {pageStyling} from '../../shared/styles';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';
import CurrentBudgets from './current-budgets';
import DailyTransactions from './daily-transactions';

type Props = {
	store?: AppStore;
	onAdd: (transaction: Transaction) => void;
	onRemove: (transaction: Transaction) => void;
};

@observer
export default
class DailyActivity extends Component<Props, {}> {
	constructor(props: Props) {
		super(props);

		this.state = {
			date: moment().toDate(),
			quickTransaction: null,
		};
	}
	public render() {
		const {
			store,
			onAdd,
			onRemove,
		} = this.props;

		return (
			<div style={pageStyling}>
				<Tabs contentContainerStyle={{
					marginTop: 15,
				}}>
					<Tab label="Budgets">
						<CurrentBudgets
							store={store}
							budgets={
								store.budgets
									.filter((budget) => budget.lastOccurance)
							}
							onAdd={onAdd}
							onRemove={onRemove}
						/>
					</Tab>
					<Tab label="Transactions">
						<DailyTransactions
							store={store}
							onAdd={onAdd}
							onRemove={onRemove}
						/>
					</Tab>
				</Tabs>
			</div>
		);
	}
}
