import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import ScheduledTransactionEdit from '../components/scheduled-transaction-edit';
import ContentArea from '../components/shared/content-area';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import ScheduledTransaction, {ScheduledTransactionFacade} from '../stores/scheduled-transaction';
import {TransactionType} from '../stores/transaction';
import BudgetsPage from './budgets-page';
import Page from './page';

const {Component} = React;

class BudgetEditStore {
	public budget: ScheduledTransaction | ScheduledTransactionFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, model: ScheduledTransactionFacade | ScheduledTransaction) {
		this.appStore = appStore;
		this.budget = model;
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
	appStore?: AppStore;
	id?: string;
	model?: ScheduledTransaction
	style?: any;
	router?: Navigo;
	onBack?: () => void;
	onSave?: () => void;
};

@inject('appStore', 'router') @observer
export default
class BudgetEditPage extends Component<Props, {}> {
	public static path = '/budget/edit/';
	public static pathParams = '/budget/edit/:id';
	public static title = 'Budget';
	private store: BudgetEditStore;

	constructor(props: Props) {
		super(props);
		let model: ScheduledTransactionFacade | ScheduledTransaction;

		if(props.model) {
			model = props.model;
		} else if(props.id) {
			model = this.props.appStore.findBudget(props.id);
		}

		if(!model) {
			model = new ScheduledTransactionFacade();
			model.type = TransactionType.BudgetedExpense;
		}
		this.store = new BudgetEditStore(props.appStore, model);
	}

	public render() {
		const {
			budget,
		} = this.store;
		const transactionsValid = this.store.budget.isValid;
		const action = (budget instanceof ScheduledTransaction && budget.id) ? 'Edit' : 'Create';
		const style = this.props.style || {};
		return (
			<Page
				className="slide-horizontal"
				style={style}
			>
				<AppBar
					onLeftIconButtonTouchTap={() => this.routeBack()}
					title={`${action} ${BudgetEditPage.title}`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<ScheduledTransactionEdit
						accounts={this.store.accounts}
						isBudget
						model={this.store.budget}
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

	private routeBack() {
		this.props.onBack ?
			this.props.onBack() :
			this.props.router.navigate(BudgetsPage.path);
	}

	private handleSaveBudget() {
		if(this.props.onSave) {
			this.props.onSave();
		} else {
			this.store.saveBudget();
			this.routeBack();
		}
	}
}
