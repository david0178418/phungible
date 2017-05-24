import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import Colors from '../../shared/colors';
import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';
import Transaction from '../../stores/transaction';
import QuickEdit from '../transaction-edit/quick-edit';

interface Props {
	store: AppStore;
	budgets: ScheduledTransaction[];
	onAdd: (transaction: Transaction) => void;
	onRemove: (transaction: Transaction) => void;
}

class Store {
	@observable public quickTransaction: Transaction | null = null;
}

@observer
export default
class CurrentBudgets extends Component<Props, {}> {
	private date: Date;
	private store: Store;

	constructor(props: Props) {
		super(props);

		this.date = new Date();
		this.store = new Store();
	}

	public render() {
		const {
			store,
			budgets,
		} = this.props;
		const {
			quickTransaction,
		} = this.store;
		return (
			<div>
				<QuickEdit
					accounts={store.accounts}
					date={this.date}
					openButtonText="Add unplanned expense"
					transaction={quickTransaction}
					onAdd={() => this.handleSaveQuickTransaction()}
					onToggleOpen={() => this.handleToggleQuickTransaction()}
				/>
				<List>
					<Subheader>
						Remaing Budgeted Amounts
					</Subheader>
					{budgets.map((budget) => {
						const amount = store.findRemainingBudgetBalance(budget.id);
						const color = amount.valCents > 0 ? Colors.Money : Colors.Debt;
						return (
							<ListItem
								key={budget.id}
								primaryText={budget.name}
								secondaryText={`renews ${moment(budget.nextOccurance).format('MMM D, YYYYY')}`}
								onTouchTap={() => this.handleAddExpenseFromBudget(budget)}
								rightIcon={
									<span style={{color}}>
										{amount.valFormattedNearestDollar}
									</span>
								}
							/>
						);
					})}
				</List>
			</div>
		);
	}

	@action private handleAddExpenseFromBudget(budget: ScheduledTransaction) {
		if(!this.store.quickTransaction) {
			this.handleToggleQuickTransaction();
		}
		this.store.quickTransaction.date = new Date();
		this.store.quickTransaction.name = `${budget.name} Expense`;
		this.store.quickTransaction.fromAccount = budget.fromAccount;
		this.store.quickTransaction.generatedFrom = budget;
	}

	@action private handleToggleQuickTransaction() {
		if(this.store.quickTransaction) {
			this.store.quickTransaction = null;
		} else {
			this.store.quickTransaction = new Transaction({
				date: this.date,
			});
		}
	}

	@action private handleSaveQuickTransaction() {
		this.props.onAdd(this.store.quickTransaction);
		this.store.quickTransaction = null;
	}
}
