import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import {ConfirmIcon, ExpenseIcon, IncomeIcon} from '../../shared/shared-components';
import {dialogStyles} from '../../shared/styles';
import Transaction from '../../stores/transaction';

interface Props {
	open: boolean;
	transactions: Transaction[];
	onDone(): void;
}

@observer
export default
class ActivationPrompt extends Component<Props, {}> {
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
						onTouchTap={() => this.handleLater()}
					/>,
					<RaisedButton
						primary
						label="Confirm All"
						onTouchTap={() => this.handleConfirmAll()}
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
									onTouchTap={() => transaction.confirm()}
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

	private handleConfirmAll() {
		this.props.transactions.forEach((transaction) => transaction.confirm());
		this.props.onDone();
	}
}
