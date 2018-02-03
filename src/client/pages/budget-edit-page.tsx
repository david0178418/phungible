import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import BudgetEdit from '../components/budget-edit';
import ContentArea from '../components/shared/content-area';
import {TransactionType} from '../constants';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Budget, {BudgetFacade} from '../stores/budget';
import BudgetsPage from './budgets-page';
import Page from './page';

const {Component} = React;

class BudgetEditStore {
	public budget: Budget | BudgetFacade;
	private appStore: AppStore;

	constructor(appStore: AppStore, model: BudgetFacade | Budget) {
		this.appStore = appStore;
		this.budget = model;
	}

	public async saveBudget() {
		if(this.budget.isValid) {
			if(this.budget instanceof BudgetFacade) {
				(await this.budget.createBudgets()).map((transaction: any) => {
					this.appStore.currentProfile.saveBudget(transaction);
					this.budget = new BudgetFacade();
				});
			} else {
				this.appStore.currentProfile.saveBudget(this.budget);
				this.budget = new BudgetFacade();
			}
			return true;
		} else {
			return false;
		}
	}

	get accounts() {
		return this.appStore.currentProfile.accounts;
	}
}

type Props = {
	appStore?: AppStore;
	id?: string;
	model?: Budget
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
		let model: BudgetFacade | Budget;

		if(props.model) {
			model = props.model;
		} else if(props.id) {
			model = this.props.appStore.currentProfile.findBudget(props.id);
		}

		if(!model) {
			model = new BudgetFacade();
			model.transactionType = TransactionType.BudgetedExpense;
		}
		this.store = new BudgetEditStore(props.appStore, model);
	}

	public render() {
		const {
			budget,
		} = this.store;
		const transactionsValid = this.store.budget.isValid;
		const action = (budget instanceof Budget && budget.id) ? 'Edit' : 'Create';
		const style = this.props.style || {};
		return (
			<Page
				animationDirection="horizontal"
				style={style}
			>
				<AppBar
					onLeftIconButtonClick={() => this.routeBack()}
					title={`${action} ${BudgetEditPage.title}`}
					iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
				/>
				<ContentArea>
					<BudgetEdit
						accounts={this.store.accounts}
						isBudget
						model={this.store.budget}
						onSubmit={() => this.handleSaveBudget()}
					/>
					<FloatingActionButton
						disabled={!transactionsValid}
						onClick={() => this.handleSaveBudget()}
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
