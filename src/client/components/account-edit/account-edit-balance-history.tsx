import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

import Account from '../../shared/stores/account';
import BalanceUpdate from '../../shared/stores/balance-update';
import MoneyEdit from '../shared/money-edit';

type Props = {
	account: Account;
};

class Store {
	@observable public newBalanceUpdate: BalanceUpdate;
	public account: Account;

	constructor(account: Account) {
		this.account = account;
		this.newBalanceUpdate = new BalanceUpdate();
	}

	public addBalanceUpdate() {
		this.account.addBalanceUpdate(this.newBalanceUpdate);
		this.newBalanceUpdate = new BalanceUpdate();
	}

	public removeBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.account.removeBalanceUpdate(balanceUpdate);
	}
}

@observer
export default
class AccountEditBalanceHistory extends Component<Props, any> {
	public store: Store;

	constructor(props: Props) {
		super(props);

		this.store = new Store(props.account);
	}

	public render() {
		const {
			account,
			newBalanceUpdate,
		} = this.store;
		return (
			<div>
				<div style={{
					textAlign: 'right',
				}}>
					<DatePicker
						autoOk
						style={{
							display: 'inline-block',
							marginRight: 15,
						}}
						textFieldStyle={{
							width: 150,
						}}
						floatingLabelText="As of"
						locale="en-US"
						onChange={(ev, value) => this.handleUpdateBalanceDate(value, newBalanceUpdate)}
						value={newBalanceUpdate.date}
					/>
					<MoneyEdit
						money={newBalanceUpdate.balance}
						style={{
							display: 'inline-block',
						}}
					/>
					<FlatButton
						label="Add Balance"
						style={{
							marginLeft: 10,
						}}
						onTouchTap={() => this.handleUpdateAddBalanceUpdate()}
						primary
					/>
				</div>
				<List>
					<Subheader>Account Balance History</Subheader>
					{account.balanceUpdateHistory.map((balanceUpdate) => {
						return (
							<ListItem
								key={balanceUpdate.id}
								primaryText={`${balanceUpdate.balance.valFormatted}`}
								secondaryText={`as of ${balanceUpdate.formattedStartDate}`}
								rightIconButton={(
									<IconButton
										onTouchTap={() => this.handleUpdateRemoveBalanceUpdate(balanceUpdate)}
									>
										<ActionDelete />
									</IconButton>
								)}
							/>
						);
					})}
					{!account.balanceUpdateHistory.length && (
						<ListItem
							primaryText="No account balance history"
						/>
					)}
				</List>
			</div>
		);
	}

	@action private handleUpdateAddBalanceUpdate() {
		this.store.addBalanceUpdate();
	};
	@action private handleUpdateRemoveBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.store.removeBalanceUpdate(balanceUpdate);
	};
	@action private handleUpdateBalanceDate(newDate: Date, balanceUpdate: BalanceUpdate) {
		balanceUpdate.date = newDate;
	};
}
