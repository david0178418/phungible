import {computed, observable} from 'mobx';
import * as moment from 'moment';

import {dateRange} from '../shared/utils';
import Account from '../stores/account';
import ScheduledTransaction from './scheduled-transaction';
import Transaction, {TransactionEffect} from './transaction';

type Moment = moment.Moment;

export default
class TrendsStore {
	@observable public fromDate: Date;
	@observable public toDate: Date;
	public accounts: Account[];
	public budgets: ScheduledTransaction[];
	public scheduledTransactions: ScheduledTransaction[];
	public transactions: Transaction[];
	@observable private selectedTrends: string[];

	constructor(params?: Partial<TrendsStore>) {
		this.fromDate = this.startOfMonth;
		this.toDate = moment().add(6, 'weeks').endOf('week').toDate();
		this.selectedTrends = ['Total'];
		(window as any).trendsStore = this; // TODO remove debug

		if(params) {
			Object.assign(this, params);
		} else {
			this.accounts = [];
			this.transactions = [];
		}
	}

	@computed get minFromDate() {
		if(!this.accounts.length) {
			return this.startOfMonth;
		}

		const oldestAccount = this.accounts.reduce((a, b) => {
			if(!a.firstBalanceUpdate) {
				return b;
			}
			return a.firstBalanceUpdate.date < b.firstBalanceUpdate.date ? a : b;
		});

		if(
			!oldestAccount.firstBalanceUpdate ||
			oldestAccount.firstBalanceUpdate.date > this.startOfMonth
		) {
			return this.startOfMonth;
		} else {
			return oldestAccount.firstBalanceUpdate.date;
		}
	}

	@computed get minToDate() {
		return moment(this.fromDate).add(1, 'day').toDate();
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

	@computed get startOfMonth() {
		return moment().startOf('month').toDate();
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

	// TODO refactor the hell out of all this;
	@computed get formattedData() {
		const dateMoments = dateRange(this.fromDate, this.toDate);
		const accounts = this.accounts;
		const combinedBudgetsScheduledTransaction = this.budgets.concat(this.scheduledTransactions);
		const budgets = this.budgets
			.filter((budget) => budget.lastOccurance)
			.filter((budget) => !budgetIsExceeded(budget, this.transactions));

		const transactionEffects: TransactionEffect[] = this.transactions
			.filter((transaction) => (
				!budgets.some((budget) => budget.id === transaction.generatedFrom.id)
			))
			.map((transaction) => transaction.affectOnDateRange(this.fromDate, this.toDate))
			.reduce((val, transactionEffectLists) => val.concat(transactionEffectLists), [])
			.filter((transaction) => transaction)
			.concat(
				budgets
					.map((budget) => ({
						accountId: budget.fromAccount.id,
						amount: budget.amount.valCents * budget.fromAccount.fromBalanceDirection,
						date: budget.lastOccurance,
					}),
			)
			.concat(
				dateMoments
					.filter((dateMoment) => dateMoment.isSameOrAfter(new Date(), 'day'))
					.map((date) => (
						combinedBudgetsScheduledTransaction
							.filter((schedTrans) => schedTrans.occursOn(date))
							.map((schedTrans) => {
								const effects = [];

								if(schedTrans.fromAccount) {
									effects.push({
										accountId: schedTrans.fromAccount.id,
										amount: schedTrans.amount.valCents * schedTrans.fromAccount.fromBalanceDirection,
										date: date.toDate(),
									});
								}

								if(schedTrans.towardAccount) {
									effects.push({
										accountId: schedTrans.towardAccount.id,
										amount: schedTrans.amount.valCents * schedTrans.towardAccount.towardBalanceDirection,
										date: date.toDate(),
									});
								}

								return effects;
							})
							.reduce((val, effects) => val.concat(effects), []	)
					))
					.reduce((val, effects) => val.concat(effects), []),
			));

		return dateMoments
			.map((dateMoment, index, arr) => {
				const dateBalances: any = {
					dateMoment,
				};

				return accounts
					.filter((account) => dateMoment.isAfter(account.firstBalanceUpdate.date))
					.reduce((val, account) => {
						val[account.id] =
							transactionEffectsOnAccountDate(account, dateMoment, transactionEffects);
						return val;
					}, dateBalances);
			})
			.map((dataPoint) => {
				const dataPointWithNames = {
					date: dataPoint.dateMoment.format('MMM DD'),
				} as any;

				accounts
					.filter((account) => dataPoint[account.id] !== undefined)
					.forEach((account) => {
						dataPointWithNames[account.name] = dataPoint[account.id];
						dataPointWithNames.Total = dataPointWithNames.Total || 0;
						dataPointWithNames.Total += dataPointWithNames[account.name] * account.globalBalanceDirection;
					});

				return dataPointWithNames;
			});
	}
}

// TODO Refactor and figure out where these co
function budgetIsExceeded(budget: ScheduledTransaction, transactions: Transaction[]) {
	const startDate = moment(budget.lastOccurance);

	return transactions
		.filter((transaction) => transaction.generatedFrom)
		.filter((transaction) => transaction.generatedFrom.id === budget.id)
		.filter((transaction) => startDate.isSameOrBefore(transaction.date, 'day'))
		.reduce((val, transaction) => val + transaction.amount.valCents, 0) > budget.amount.valCents;
}

function transactionEffectsOnAccountDate(account: Account, date: Moment, transactionEffects: TransactionEffect[]) {
	const balance = account.lastBalanceUpdateAsOf(date.toDate()).amount.valCents;
	const totalChange = transactionEffects
		.filter((transactionEffect) =>
			transactionEffect.accountId === account.id && date.isSameOrAfter(transactionEffect.date, 'day'))
		.map((transactionEffect) => transactionEffect.amount)
		.reduce((val, amount) => val + amount, 0);

	return balance + totalChange;
}
