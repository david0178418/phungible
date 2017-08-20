import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import {observer} from 'mobx-react';
import * as React from 'react';

import {ConfirmIcon, ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import {dialogStyles} from '../../shared/styles';
import AppStore from '../../stores/app';
import Transaction from '../../stores/transaction';

const {Component} = React;

interface Props {
	store: AppStore;
	open: boolean;
	transactions: Transaction[];
	onDone(): void;
}

@observer
export default
class TransactionConfirmationPrompt extends Component<Props, {}> {
	public render() {
		const {
			open,
			transactions,
		} = this.props;

		return (
			<Dialog
				{...dialogStyles}
				modal
				open={open}
				title="Pending Transactions"
				actions={[
					<FlatButton
						label="Later"
						onClick={() => this.handleLater()}
					/>,
					<RaisedButton
						primary
						label="Confirm All"
						onClick={() => this.handleConfirmAll()}
					/>,
				]}
			>
				<List>
					{transactions.map((transaction) => (
						<ListItem
							key={transaction.id}
							primaryText={`${transaction.amount.valFormatted} ${transaction.name}`}
							secondaryText={(
								(transaction.fromAccount ?
									`From: ${transaction.fromAccount.name}` : '') +
								(transaction.towardAccount && transaction.fromAccount ? ', ' : '') +
								(transaction.towardAccount ?
									`Toward: ${transaction.towardAccount.name}` : '')
							)}
							leftIcon={(
								// Hack for circular dep
								transaction.type === 2 ?
									<IncomeIcon/> :
									<ExpenseIcon/>
							)}
							rightIconButton={(
								<IconButton
									onClick={() => this.handleConfirm(transaction)}
								>
									<ConfirmIcon/>
								</IconButton>
							)}
						/>
					))}
				</List>
			</Dialog>
		);
	}

	private handleLater() {
		this.props.onDone();
	}

	private handleConfirm(transaction: Transaction) {
		transaction.confirm();
		this.props.store.save();
	}

	private handleConfirmAll() {
		this.props.transactions.forEach((transaction) => transaction.confirm());
		this.props.onDone();
		this.props.store.save();
	}
}
