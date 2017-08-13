import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {inject} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import GettingStartedPage from '../../pages/getting-started-page';
import {dialogStyles} from '../../shared/styles';

interface State {
	openContent: string | JSX.Element;
}

interface Props {
	router?: Navigo;
}

@inject('router')
export default
class Help extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			openContent: '',
		};
	}

	public render() {
		return (
			<div>
				<List>
					<ListItem
						primaryText="Getting Started"
						onTouchTap={() => this.handleOpenGettingStarted()}
					/>
					<ListItem
						primaryText="About Accounts"
						onTouchTap={() => this.handleOpen(
							<div>
								Accounts are anywhere money can be placed or withdrawn.
								This can be a bank account, a credit card, or even a piggy
								bank.
								<p>
									At least one balance update is needed to begin
									tracking your balance.  The balance over time
									is calculated with transactions against the
									account.  Any aditional balance updates provided
									are used to determine if any untracked
									expenses exist.  This can be useful to resync
									if you were not able to enter some transactions.
								</p>
								<small>
									<em>Note: Interest rates are not currently applied to accounts.</em>
								</small>
							</div>,
						)}
					/>
					<ListItem
						primaryText="About Transactions"
						onTouchTap={() => this.handleOpen(
							<div>
								A transaction is just movement of money. The most
								common case will be an expense.  But a transaction
								could also include moving money from your checking
								to savings or a payment to a credit card.
								<p>
									If a transaction is created from a Recurring Transaction,
									it will need to be confirmed.  You will be prompted
									to do this on your next login.  This will also help
									remind you about what your money plan.
								</p>
							</div>,
						)}
					/>
					<ListItem
						primaryText="About Recurring Transactions"
						onTouchTap={() => this.handleOpen(
							<div>
								Recurring transactions are your known, planned expenses.
								Good examples of these are a car payment or moving money
								to a savings account.  On the date these occur, this
								will generate an unconfirmed transaction.
								<p>
									Any transaction generated from a recurring
									transaction can be edited for one-off changes.
								</p>
							</div>,
						)}
					/>
					<ListItem
						primaryText="About Budgets"
						onTouchTap={() => this.handleOpen(
							<div>
								Budgets are lesser-known expenses that you wish to
								control.  On the trends chart, when projecting
								forward, it is assumed you will spend the entire
								amount budgeted.  Once the budget period passes, the
								budgeted amount is forgotten and only your actual
								expenses are shown.
								<p>
									A budgeted expense can be entered from the
									<em>Daily Activity</em> page by clicking on
									the budget category.  From here, you will
									be able to create a transaction that will
									draw from this amount.
								</p>
							</div>,
						)}
					/>
				</List>
				<Dialog
					{...dialogStyles}
					open={!!this.state.openContent}
					onRequestClose={() => this.handleClose()}
					actions={[
						<FlatButton
							label="Done"
							primary
							onTouchTap={() => this.handleClose()}
						/>,
					]}
				>
					{this.state.openContent}
				</Dialog>
			</div>
		);
	}

	private handleClose() {
		this.setState({
			openContent: '',
		});
	}

	private handleOpen(content: string | JSX.Element) {
		this.setState({
			openContent: content,
		});
	}

	private handleOpenGettingStarted() {
		this.props.router.navigate(GettingStartedPage.path);
	}
}
