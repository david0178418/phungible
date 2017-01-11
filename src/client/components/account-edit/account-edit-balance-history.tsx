import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import {
	Button,
	Col,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
} from 'reactstrap';

import Icon from '../../shared/icon';
import Account from '../../shared/stores/account';
import BalanceUpdate from '../../shared/stores/balance-update';

type Props = {
	account: Account;
};

type BalanceHistoryUpdateProps = {
	balanceUpdate: BalanceUpdate;
	onRemove(balanceUpdate: BalanceUpdate): void;
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

function BalanceHistoryUpdate({balanceUpdate, onRemove}: BalanceHistoryUpdateProps) {
	return (
		<FormGroup row>
			<Label sm={4}>
				${balanceUpdate.prettyAmount}
			</Label>
			<Label sm={2}>
				as of
			</Label>
			<Label sm={4}>
				{balanceUpdate.formattedStartDate}
			</Label>
			<Col sm={2}>
				<Button
					color="link"
					onClick={onRemove}
				>
					<Icon type="close" />
				</Button>
			</Col>
		</FormGroup>
	)
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
				<FormGroup row>
					<legend className="col-form-legend col-sm-12">Balance History</legend>
					<Col sm={4}>
						<InputGroup>
							<InputGroupAddon>
								<Icon type="usd" />
							</InputGroupAddon>
							<Input
								onChange={(ev: any) => this.handleUpdateBalanceAmount((ev.target as HTMLInputElement).valueAsNumber, newBalanceUpdate)}
								placeholder="0.00"
								step={10}
								type="number"
								value={newBalanceUpdate.prettyAmount}
							/>
						</InputGroup>
					</Col>
					<Col sm={6}>
						<InputGroup>
							<InputGroupAddon>
								<Icon type="calendar" />
							</InputGroupAddon>
							<Input
								className="TEMP_DATE_INPUT_FIX"
								onChange={(ev: any) => this.handleUpdateBalanceDate((ev.target as HTMLInputElement).valueAsDate, newBalanceUpdate)}
								type="date"
								value={newBalanceUpdate.inputFormattedDate}
							/>
						</InputGroup>
					</Col>
					<Col sm={2}>
						<Button
							color="link"
							onClick={() => this.handleUpdateAddBalanceUpdate()}
						>
							<Icon type="check"/>
						</Button>
					</Col>
				</FormGroup>
				{account.balanceHistory.map((balanceUpdate) => {
					return (
						<BalanceHistoryUpdate
							balanceUpdate={balanceUpdate}
							onRemove={() => this.handleUpdateRemoveBalanceUpdate(balanceUpdate)}
						/>
					);
				})}
			</div>
		);
	}

	@action private handleUpdateAddBalanceUpdate() {
		this.store.addBalanceUpdate();
	};
	@action private handleUpdateRemoveBalanceUpdate(balanceUpdate: BalanceUpdate) {
		this.store.removeBalanceUpdate(balanceUpdate);
	};
	@action private handleUpdateBalanceAmount(newAmount: number, balanceUpdate: BalanceUpdate) {
		balanceUpdate.balance = newAmount * 100;
	};
	@action private handleUpdateBalanceDate(newDate: Date, balanceUpdate: BalanceUpdate) {
		balanceUpdate.date = newDate;
	};
}
