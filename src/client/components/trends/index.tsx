import {computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';

import DatePicker from 'material-ui/DatePicker';
import Account, {AccountType} from '../../shared/stores/account';
import Transaction from '../../shared/stores/transaction';
import TrendsChart from './trends-chart';

type Props = {
	accounts: Account[];
	transactions: Transaction[];
};

class TrendsStore {
	@observable public fromDate: Date;
	@observable public toDate: Date;
	public accounts: Account[];
	public transactions: Transaction[];

	constructor(params?: Partial<TrendsStore>) {
		this.fromDate = moment().startOf('month').toDate();
		this.toDate = moment().endOf('month').toDate();
		(window as any).trendsStore = this; // TODO remove debug

		if(params) {
			return Object.assign(this, params);
		}
	}

	@computed get minDate() {
		let oldestBalanceDate: Date;

		this.accounts.forEach((a, b) => {
			// TODO Assuming last date is oldest.  Need to set up get/set
			// to make this assumption true
			const firstEntry = a.balanceHistory[a.balanceHistory.length - 1].date;

			if(!oldestBalanceDate || oldestBalanceDate > firstEntry) {
				oldestBalanceDate = firstEntry;
			}
		});
		return oldestBalanceDate;
	}

	@computed get accountNames() {
		return this.accounts.map((account) => account.name);
	}

	public applyTransactions(account: Account, date: Date) {
		const lastBalanceUpdate = account.lastBalanceUpdate(date);
		const {Debt, Savings} = AccountType;

		this.transactions.forEach((transaction) => {
			const transactionDate = moment(transaction.date);

			if(lastBalanceUpdate.date.isSameOrBefore(transactionDate, 'd') && transactionDate.isSameOrBefore(date, 'd')) {
				if(transaction.fromAccount && transaction.fromAccount.id === account.id) {
					lastBalanceUpdate.amount += transaction.amount * (account.type === Debt ? 1 : -1);
				} else if(transaction.towardAccount && transaction.towardAccount.id === account.id) {
					lastBalanceUpdate.amount += transaction.amount * (account.type === Savings ? 1 : -1);
				}}
		});

		return lastBalanceUpdate.amount;
	}

	@computed get formattedData() {
		const fromDate = moment(this.fromDate);
		const toDate = moment(this.toDate);
		const today = moment();
		const diff = toDate.diff(fromDate, 'days');
		const data: any[] = [];

		for(let x = 0; x < diff; x++) {
			const accountBalances: any = {
				date: fromDate.format('MMM DD'),
			};
			this.accounts.forEach((account) => {
				if(
					fromDate.isSameOrBefore(today, 'day') &&
					fromDate.isSameOrAfter(account.firstBalanceUpdate.date)
				) {
					const balance = this.applyTransactions(account, fromDate.toDate());
					accountBalances.Total = accountBalances.Total || 0;
					accountBalances[account.name] = balance;
					accountBalances.Total += balance * (account.type === AccountType.Savings ? 1 : -1);
				} else {
					// TODO projections
				}
			});
			data.push(accountBalances);
			fromDate.add(1, 'days');
		}

		return data;
	}
}

@observer
export default
class Trends extends Component<Props, any> {
	private store: TrendsStore;

	constructor(props: Props) {
		super(props);
		this.store = new TrendsStore(props);
	}

	public render() {
		return (
			<div>
				<DatePicker
					autoOk
					floatingLabelText="From"
					minDate={this.store.minDate}
					locale="en-US"
					onChange={(ev, value) => this.handleUpdateFromDate(value)}
					style={{display: 'inline-block'}}
					value={this.store.fromDate}
				/>
				{' '}
				<DatePicker
					autoOk
					floatingLabelText="To"
					locale="en-US"
					onChange={(ev, value) => this.handleUpdateToDate(value)}
					style={{display: 'inline-block'}}
					value={this.store.toDate}
				/>
				{/*this.store.accounts.map((account) => this.renderBalances(account))*/}
				<TrendsChart
					data={this.store.formattedData}
					accountNames={this.store.accountNames}
				/>
			</div>
		);
	}

	private handleUpdateFromDate(newDate: Date) {
		this.store.fromDate = newDate;
	}

	private handleUpdateToDate(newDate: Date) {
		this.store.toDate = newDate;
	}
}
