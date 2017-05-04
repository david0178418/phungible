import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import ScheduledTransactionEdit from '../components/scheduled-transaction-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction, {ScheduledTransactionFacade} from '../stores/scheduled-transaction';
import {TransactionType} from '../stores/transaction';
import Page from './page';

class BudgetEditStore {
	public budget: ScheduledTransaction | ScheduledTransactionFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, budgetId?: string) {
		this.appStore = appStore;

		if(budgetId) {
			this.budget = appStore.findBudget(budgetId);
		} else {
			this.budget = new ScheduledTransactionFacade();
			this.budget.type = TransactionType.BudgetedExpense;
		}
	}

	public saveBudget() {
		if(this.budget.isValid) {
			if(this.budget instanceof ScheduledTransactionFacade) {
				this.budget.createScheduledTransactions().map((transaction) => {
					this.appStore.saveBudget(transaction);
					this.budget = new ScheduledTransactionFacade();
				});
			} else {
				this.appStore.saveBudget(this.budget);
				this.budget = new ScheduledTransactionFacade();
			}
			return true;
		} else {
			return false;
		}
	}

	get accounts() {
		return this.appStore.accounts;
	}
}

type Props = {
	id: string;
	store?: AppStore;
};

@observer
export default
class CreateScheduledTransaction extends Component<Props, {}> {
	public static path = '/budget/edit/';
	public static pathParams = '/budget/edit/:id';
	public static title = 'Budget';
	private store: BudgetEditStore;

	constructor(props: Props) {
		super(props);
		this.store = new BudgetEditStore(props.store, props.id);
	}

	public render() {
		const {
			budget,
		} = this.store;
		const transactionsValid = this.store.budget.isValid;
		const action = (budget instanceof ScheduledTransaction && budget.id) ? 'Edit' : 'Create';

		return (
			<Page className="slide-horizontal">
				<AppBar
					onLeftIconButtonTouchTap={() => window.history.back()}
					title={`${action} ${CreateScheduledTransaction.title}`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ScheduledTransactionEdit
						accounts={this.store.accounts}
						isBudget
						scheduledTransaction={this.store.budget}
						onSubmit={() => this.handleSaveBudget()}
					/>
					<FloatingActionButton
						disabled={!transactionsValid}
						onTouchTap={() => this.handleSaveBudget()}
						style={floatingActionButtonStyle}
						zDepth={2}
					>
						<ActionDone />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}

	private handleSaveBudget() {
		setTimeout(() => {
			this.store.saveBudget();
			window.history.back();
		}, 100);
	}
}
