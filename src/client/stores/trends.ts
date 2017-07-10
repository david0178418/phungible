import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, list, object, serializable} from 'serializr';

import {dateRange} from '../shared/utils';
import Account from '../stores/account';
import ScheduledTransaction from './scheduled-transaction';
import Transaction, {TransactionEffect} from './transaction';

type Moment = moment.Moment;

export default
class TrendsStore {
	@action public static deserialize(data: any) {
		return deserialize(TrendsStore, data);
	}
	@observable public fromDate: Date;
	@observable public toDate: Date;
	@serializable(list(object(Account)))
	public accounts: Account[];
	@serializable(list(object(ScheduledTransaction)))
	public budgets: ScheduledTransaction[];
	@serializable(list(object(ScheduledTransaction)))
	public scheduledTransactions: ScheduledTransaction[];
	public today: Date;
	@serializable(list(object(Transaction)))
	public transactions: Transaction[];
	@observable private selectedTrends: string[];

	constructor(params: Partial<TrendsStore> = {}) {
		Object.assign(this, {
			accounts: [],
			fromDate: this.startOfMonth,
			toDate: moment().add(6, 'weeks').endOf('week').toDate(),
			today: new Date(),
			transactions: [],
		}, params);
		this.selectedTrends = this.trendOptions;
		(window as any).trendsStore = this; // TODO remove debug
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
		return moment(this.today).startOf('month').toDate();
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
		const confirmedTransactions = this.transactions.filter((transaction) => !transaction.needsConfirmation);

		const transactionEffects: TransactionEffect[] = confirmedTransactions
			.map((transaction) => transaction.affectOnDateRange(this.fromDate, this.toDate))
			.reduce((val, transactionEffectLists) => val.concat(transactionEffectLists), [])
			.filter((transaction) => transaction);

		const budgetedAmounts = this.budgets
			.map((budget) => {
				const earliestUnpassedDateInRange =
					budget.earliestUnpassedDateInRange(dateMoments[0], dateMoments[dateMoments.length - 1]);

				if(!earliestUnpassedDateInRange) {
					return null;
				}

				const date = budget.occuranceOnOrBeforeDate(earliestUnpassedDateInRange);

				if(!date) {
					return null;
				}

				return {
					accountId: budget.fromAccount.id,
					amount: budget.amount.valCents * budget.fromAccount.fromBalanceDirection,
					date,
				};
			})
			.filter((val) => val);

		const budgetAdjustments: TransactionEffect[] = this.budgets
			.map((budget) => {
				const startDate = budget.occuranceOnOrBeforeDate(dateMoments[0].toDate());

				if(!startDate) {
					return [];
				}

				const range = dateRange(startDate, dateMoments[dateMoments.length - 1]);
				let remainingPeriodTotal = 0;
				return range
					.map((date) => {
						if(!budget.earliestUnpassedDateInRange(date)) {
							return null;
						}

						remainingPeriodTotal = budget.occursOn(date) ? budget.amount.valCents : remainingPeriodTotal;

						if(!remainingPeriodTotal) {
							return null;
						}

						const budgetTransactionTotal = confirmedTransactions
							.filter((transaction) => transaction.generatedFrom)
							.filter((transaction) => transaction.generatedFrom.id === budget.id)
							.filter((transaction) => transaction.occursOn(date))
							.reduce((sum, transaction) => sum + transaction.amount.valCents, 0);

						if(budgetTransactionTotal && remainingPeriodTotal > 0) {
							let amount = -(budgetTransactionTotal * budget.fromAccount.fromBalanceDirection);

							if(remainingPeriodTotal < amount) {
								amount = remainingPeriodTotal;
								remainingPeriodTotal = 0;
							}

							return {
								accountId: budget.fromAccount.id,
								amount,
								date: date.toDate(),
							};
						}

						return null;
					})
					.filter((transactionEffect) => transactionEffect);
			})
			.reduce((val, effects) => val.concat(effects), [])
			.reduce((val, effects) => val.concat(effects), []);

		const budgetLeadingEdgeRollup = this.budgets
			.map((budget) => {
				const x = budgetAdjustments
					.filter((budgetedEffect) => budgetedEffect.accountId === budget.fromAccount.id)
					.filter((budgetedEffect) => !dateMoments[0].isSameOrBefore(budgetedEffect.date, 'day'));

				if(!x.length) {
					return null;
				}

				return x.reduce((rollUp, budgetedEffect) => {
						rollUp.amount += budgetedEffect.amount;
						return rollUp;
					}, {
						accountId: budget.fromAccount.id,
						amount: budget.amount.valCents * budget.fromAccount.fromBalanceDirection,
						date: dateMoments[0].toDate(),
					});
			})
			.filter((val) => val);

		const pendingScheduledTransactionEffects: TransactionEffect[] = dateMoments
			.filter((dateMoment) => dateMoment.isAfter(this.today, 'day'))
			.map((date) => (
				combinedBudgetsScheduledTransaction
					.filter((schedTrans) => schedTrans)
					.filter((schedTrans) => schedTrans.occursOn(date))
					.map((schedTrans) => {
						const effects = [];

						if(
							schedTrans.fromAccount && (
								!date.isSame(schedTrans.fromAccount.latestBalanceUpdate.date, 'day') ||
								!schedTrans.occursOn(schedTrans.fromAccount.latestBalanceUpdate.date)
							)
						) {
							effects.push({
								accountId: schedTrans.fromAccount.id,
								amount: schedTrans.amount.valCents * schedTrans.fromAccount.fromBalanceDirection,
								date: date.toDate(),
							});
						}

						if(
							schedTrans.towardAccount && (
								!date.isSame(schedTrans.towardAccount.latestBalanceUpdate.date, 'day') ||
								!schedTrans.occursOn(schedTrans.towardAccount.latestBalanceUpdate.date)
							)
						) {
							effects.push({
								accountId: schedTrans.towardAccount.id,
								amount: schedTrans.amount.valCents * schedTrans.towardAccount.towardBalanceDirection,
								date: date.toDate(),
							});
						}

						return effects;
					})
					.reduce((val, effects) => val.concat(effects), [])
			))
			.reduce((val, effects) => val.concat(effects), []);

		const allEffects = [].concat(
			transactionEffects,
			budgetedAmounts,
			budgetAdjustments,
			budgetLeadingEdgeRollup,
			pendingScheduledTransactionEffects,
		);

		return dateMoments
			.map((dateMoment, index, arr) => {
				const dateBalances: any = {
					dateMoment,
				};

				return accounts
					.filter((account) => dateMoment.isSameOrAfter(account.firstBalanceUpdate.date, 'day'))
					.reduce((val, account) => {
						val[account.id] =
							effectsOnAccountDate(account, dateMoment, allEffects);
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

function effectsOnAccountDate(account: Account, date: Moment, transactionEffects: TransactionEffect[]) {
	const balance = account.lastBalanceUpdateAsOf(date.toDate()).amount.valCents;
	const totalChange = transactionEffects
		.filter((transactionEffect) =>
			transactionEffect.accountId === account.id && date.isSameOrAfter(transactionEffect.date, 'day'))
		.map((transactionEffect) => transactionEffect.amount)
		.reduce((val, amount) => val + amount, 0);

	return balance + totalChange;
}
