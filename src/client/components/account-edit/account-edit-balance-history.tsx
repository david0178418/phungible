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

import Colors from '../../shared/colors';
import formatDate from '../../shared/utils/format-date';
import Account from '../../stores/account';
import BalanceUpdate from '../../stores/balance-update';
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
					display: 'flex',
					flexDirection: 'column',
				}}>
					<div
						style={{
							display: 'flex',
						}}
					>
						<DatePicker
							autoOk
							style={{
								marginRight: 15,
							}}
							textFieldStyle={{
								width: 150,
							}}
							formatDate={(d) => formatDate(d)}
							floatingLabelText="As of"
							firstDayOfWeek={0}
							onChange={(ev, value) => this.handleUpdateBalanceDate(value, newBalanceUpdate)}
							value={newBalanceUpdate.date}
						/>
						<MoneyEdit
							money={newBalanceUpdate.balance}
							style={{
								marginLeft: 10,
							}}
						/>
					</div>
					<div>
						<FlatButton
							label="Add Balance"
							onTouchTap={() => this.handleUpdateAddBalanceUpdate()}
							primary
						/>
					</div>
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
							style={{
								color: Colors.Error,
							}}
							primaryText="At least one account balance update required"
						/>
					)}
				</List>
			</div>
		);
	}

	@action private handleUpdateAddBalanceUpdate() {
		this.store.addBalanceUpdate();
	}
	@action private handleUpdateRemoveBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.store.removeBalanceUpdate(balanceUpdate);
	}
	@action private handleUpdateBalanceDate(newDate: Date, balanceUpdate: BalanceUpdate) {
		balanceUpdate.date = newDate;
	}
}
