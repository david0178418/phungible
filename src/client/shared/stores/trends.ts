import {computed, observable} from 'mobx';
import * as moment from 'moment';

import Account, {AccountType} from '../../shared/stores/account';
import Transaction from './transaction';

export default
class TrendsStore {
	@observable public fromDate: Date;
	@observable public toDate: Date;
	public accounts: Account[];
	public transactions: Transaction[];
	@observable private selectedTrends: string[];

	constructor(params?: Partial<TrendsStore>) {
		this.fromDate = moment().startOf('month').toDate();
		this.toDate = moment().endOf('month').toDate();
		this.selectedTrends = ['Total'];
		(window as any).trendsStore = this; // TODO remove debug

		if(params) {
			Object.assign(this, params);
		} else {
			this.accounts = [];
			this.transactions = [];
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

	@computed get selectedTrendOptions() {
		return this.selectedTrends.slice(0);
	}

	@computed get trendOptions() {
		return (['Total']).concat(this.accountNames);
	}

	@computed get selectedTrendData() {
		const selectedTrends = this.selectedTrendOptions;

		return this.formattedData.map((dateData) => {
			const newDateData: any = {
				date: dateData.date,
			};

			selectedTrends.forEach((trendName) => {
				newDateData[trendName] = dateData[trendName];
			});

			return newDateData;
		});
	}

	public removeSelectedTrend(removedTrend: string) {
		this.selectedTrends = (this.selectedTrends as any).filter((trend: string) => trend !== removedTrend);
	}

	public selectTrend(trend: string) {
		this.selectedTrends.push(trend);
	}

	public trendIsSelected(trend: string) {
		return this.selectedTrends.indexOf(trend) !== -1;
	}

	public applyTransactions(account: Account, date: Date) {
		const lastBalanceUpdate = account.lastBalanceUpdate(date);
		const {Debt, Savings} = AccountType;
		let total = lastBalanceUpdate.amount.valCents;

		this.transactions.forEach((transaction) => {
			const transactionDate = moment(transaction.date);

			if(lastBalanceUpdate.date.isSameOrBefore(transactionDate, 'd') && transactionDate.isSameOrBefore(date, 'd')) {
				if(transaction.fromAccount && transaction.fromAccount.id === account.id) {
					total += transaction.amount.valCents * (account.type === Debt ? 1 : -1);
				} else if(transaction.towardAccount && transaction.towardAccount.id === account.id) {
					total += transaction.amount.valCents * (account.type === Savings ? 1 : -1);
				}}
		});

		return total;
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
	@computed get summaryData() {
		return this.formattedData.map((day) => ({
			Total: day.Total,
			date: day.date,
		}));
	}
	public getAccountData() {
		return this.formattedData.map((day) => {
			delete day.total;
			return day;
		});
	}
}
