import {computed, observable} from 'mobx';
import * as moment from 'moment';

import Account, {AccountType} from '../../shared/stores/account';
import Transaction from './transaction';

type BalanceMap = {
	[key: string]: number;
};
type BalanceData = {
	Total: number;
	date: string;
} & BalanceMap;

const DAY_OFFSET = 0;

export default
class TrendsStore {
	@observable public fromDate: Date;
	@observable public toDate: Date;
	public accounts: Account[];
	public transactions: Transaction[];
	@observable private selectedTrends: string[];

	constructor(params?: Partial<TrendsStore>) {
		this.fromDate = moment().subtract(DAY_OFFSET, 'days').startOf('month').toDate();
		this.toDate = moment().subtract(DAY_OFFSET, 'days').endOf('month').toDate();
		this.selectedTrends = ['Total', 'Total (projection)'];
		(window as any).trendsStore = this; // TODO remove debug

		if(params) {
			Object.assign(this, params);
		} else {
			this.accounts = [];
			this.transactions = [];
		}
	}

	@computed get minDate() {
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

		return this.formattedData.map((dateData) => {
			const newDateData: any = {
				date: dateData.date,
			};

			selectedTrends.forEach((trendName) => {
				if(dateData[trendName]) {
					newDateData[trendName] = dateData[trendName];
				}
			});

			return newDateData;
		});
	}

	public removeSelectedTrend(removedTrend: string) {
		this.selectedTrends = (this.selectedTrends as any).filter((trend: string) => !trend.startsWith(removedTrend));
	}

	public selectTrend(trend: string) {
		this.selectedTrends.push(trend);
		this.selectedTrends.push(`${trend} (projection)`);
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

		for(let x = 0; x < diff; x++) {
			const accountBalances: BalanceData = {
				Total: 0,
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
					balance = account.applyTransactions(this.transactions, fromDate.toDate());

					if(balance) {
						accountBalances[account.name] = balance;
						accountBalances.Total += balance * (account.type === AccountType.Savings ? 1 : -1);
					}
				}

				if(
					fromDate.isSameOrAfter(today, 'day') &&
					fromDate.isAfter(account.firstBalanceUpdate.date)
				) {
					accountBalances['Total (projection)'] = accountBalances['Total (projection)'] || 0;

					if(fromDate.isSame(today, 'day')) {
						balance = account.applyTransactions(this.transactions, fromDate.toDate());
					} else {
						balance = account.getBalanceProjection(fromDate.toDate());
					}

					if(balance) {
						accountBalances[`${account.name} (projection)`] = balance;
						accountBalances['Total (projection)'] += balance * (account.type === AccountType.Savings ? 1 : -1);
					}
				}
			});
			data.push(accountBalances);
			fromDate.add(1, 'days');
		}

		return data;
	}
}