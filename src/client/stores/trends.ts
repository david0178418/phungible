import {computed, observable} from 'mobx';
import * as moment from 'moment';

import Account from '../stores/account';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

type BalanceMap = {
	[key: string]: number;
};
type BalanceData = {
	date: string;
} & BalanceMap;

export default
class TrendsStore {
	@observable public fromDate: Date;
	@observable public toDate: Date;
	public accounts: Account[];
	public scheduledTransactions: ScheduledTransaction[];
	public transactions: Transaction[];
	@observable private selectedTrends: string[];

	constructor(params?: Partial<TrendsStore>) {
		this.fromDate = moment().subtract(1, 'month').startOf('month').toDate();
		this.toDate = moment().add(2, 'month').endOf('month').toDate();
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
		if(!this.accounts.length) {
			return new Date();
		}

		const oldestAccount = this.accounts.reduce((a, b) => {
			if(!a.firstBalanceUpdate) {
				return b;
			}
			return a.firstBalanceUpdate.date < b.firstBalanceUpdate.date ? a : b;
		});

		return oldestAccount.firstBalanceUpdate && oldestAccount.firstBalanceUpdate.date;
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
		const formattedData = this.formattedData;
		const returnVal: any[] = [];

		// For-loop performance optimization
		for(let x = 0; x < formattedData.length; x++) {
			const dateData = formattedData[x];
			const newDateData: any = {
				date: dateData.date,
			};

			for(let y = 0; y < selectedTrends.length; y++) {
				const trendName = selectedTrends[y];

				if(dateData[trendName] || dateData[trendName] === 0) {
					newDateData[trendName] = dateData[trendName];
				}
			}
			returnVal.push(newDateData);
		}

		return returnVal;
	}

	public removeSelectedTrend(removedTrend: string) {
		this.selectedTrends = (this.selectedTrends as any).filter((trend: string) => !trend.startsWith(removedTrend));
	}

	public selectTrend(trend: string) {
		this.selectedTrends.push(trend);
	}

	public trendIsSelected(trend: string) {
		return this.selectedTrends.indexOf(trend) !== -1;
	}

	@computed get formattedData() {
		const fromDate = moment(this.fromDate);
		const toDate = moment(this.toDate);
		const today = moment();
		const diff = toDate.diff(fromDate, 'days');
		const data: any[] = [];
		let prevBalances: any = {};

		for(let x = 0; x < diff; x++) {
			const accountBalances: BalanceData = {
				date: fromDate.format('MMM DD') as any, // TODO Figure out why this is needed
			};
			this.accounts.forEach((account) => {
				let balance;

				if(!account.firstBalanceUpdate) {
					return;
				}

				if(
					fromDate.isSameOrBefore(today, 'day') &&
					fromDate.isSameOrAfter(account.firstBalanceUpdate.date)
				) {
					if(accountBalances['Total'] === undefined) {
						accountBalances['Total'] = 0;
					}

					balance = account.applyTransactions(this.transactions, fromDate.toDate());

					if(balance) {
						accountBalances[account.name] = balance;
						accountBalances['Total'] += balance;
					}
				}

				if(
					fromDate.isSameOrAfter(today, 'day') &&
					fromDate.isSameOrAfter(account.firstBalanceUpdate.date)
				) {
					if(accountBalances['Total'] === undefined) {
						accountBalances['Total'] = 0;
					}

					if(fromDate.isSame(today, 'day')) {
						balance = account.applyTransactions(this.transactions, fromDate.toDate());
					} else {
						let prevBalance = 0;

						if(prevBalances[account.name]) {
							prevBalance = prevBalances[account.name];
						} else if(prevBalances[account.name]) {
							prevBalance = prevBalances[account.name];
						}
						const change = account.changeOnDate(this.scheduledTransactions, fromDate.toDate());
						balance = change + prevBalance;
					}

					accountBalances[account.name] = balance;
					accountBalances['Total'] += balance;
				}
			});

			prevBalances = accountBalances;
			data.push(accountBalances);
			fromDate.add(1, 'days');
		}

		return data;
	}
}
