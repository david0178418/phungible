import {
	format,
	isBefore,
	endOfToday,
	isToday,
} from 'date-fns';
import {
	Account,
	AccountType,
	RecurringTransaction,
	Budget,
	Transaction,
} from '@shared/interfaces';
import { getAccountTransactionsInRange } from '@common/api';
import {
	dateRange,
	last,
} from '@shared/utils';
import { endOfDay } from 'date-fns/esm';
import { occurrancesInRange, currentPeriod } from '@common/occurrence-fns';

interface Action {
	fromAccountId: string;
	towardAccountId?: string;
	amount: number;
	date: string;
}

function fromBalanceDirection(accountType: AccountType) {
	return accountType === AccountType.Debt ? 1 : -1;
}

function towardBalanceDirection(accountType: AccountType) {
	return accountType === AccountType.Savings ? 1 : -1;
}

function lastBalanceUpdateAsOf(account: Account, date: Date) {
		return account
			.balanceUpdateHistory
			.find(update =>
				isBefore(new Date(update.date), date),
			) || null;
}

function nextBalanceUpdateAsOf(account: Account, date: Date) {
		return account
			.balanceUpdateHistory
			.find(update =>
				!isBefore(new Date(update.date), date),
			) || null;
}

function getNextRelevantBalanceUpdate(account: Account, date: Date) {
	return lastBalanceUpdateAsOf(account, date) || nextBalanceUpdateAsOf(account, date);
}

export
async function foo(account: Account, from: Date, to: Date) {
	const range = dateRange(from, to)
		.filter((data, i, r) => (
			isToday(data) ||
			!(i % (r.length / 20 | 0))
		));

	const cutoff = getNextRelevantBalanceUpdate(account, from);

	const relevantRange = range.filter(date => (
		cutoff && !isBefore(date, new Date(cutoff.date))
	));

	const lastDate = last(relevantRange);
	return getRelevantTransactions(account.id, cutoff?.date, lastDate);
}

interface BalanceOnDateArgs {
	account: Account;
	budgets: Budget[];
	recurringTransactions: RecurringTransaction[];
	transactions: Transaction[];
	from: Date;
	to: Date;
}

export
async function generateBalanceHistory(args: BalanceOnDateArgs) {
	const {
		from,
		to,
		account,
		recurringTransactions,
		transactions,
		budgets,
	} = args;

	const range = dateRange(from, to)
		.filter((data, i, r) => (
			isToday(data) ||
			!(i % (r.length / 20 | 0))
		));
	const cutoff = getNextRelevantBalanceUpdate(account, from);
	const nullDates = range.filter(date => (
		!cutoff || isBefore(date, new Date(cutoff.date))
	));
	const relevantRange = range.filter(date => (
		cutoff && !isBefore(date, new Date(cutoff.date))
	));
	const lastDate = last(relevantRange);
	const relevantTransactions = transactions.filter(t => t.id === account.id);
	const combined = []
		.concat(
			relevantTransactions,
		)
		.concat(
			getUpcomingRecurringTransactions(recurringTransactions, lastDate),
		)
		.concat(
			getUpcomingBudgetTransactions(budgets, lastDate),
		)
		.concat(
			getCurrentBudgetPeriodOffsets(budgets, account?.id || '', transactions),
		);

	return nullDates.map(date => ({
			[account.name]: null,
			date: format(date, 'M/d/YYY'),
		}))
		.concat(
			relevantRange.map((date, i) => ({
				date: format(date, 'M/d/YYY'),
				[account.name]: effectsToBalances(account, combined, date.toISOString()),
			})),
		);
}

function getCurrentBudgetPeriodOffsets(budgets: Budget[], accountId: string, transactions: Transaction[]): Action[] {
	const date = new Date().toISOString();

	return budgets
		.map(b => {
			let offset = 0;
			const [start, end] = currentPeriod(b);
			const budgetedTransactions = transactions
				.filter(t => t.parentBudgetId === b.id)
				.filter(t => (t.date > start) && (t.date < end ));

			const used = budgetedTransactions 
				.reduce((total, t) => total + t.amount, 0);

			if(used < b.amount) {
				offset = budgetedTransactions
					.filter(t => t.fromAccountId === accountId)
					.reduce((total, t) => total + t.amount, 0);
			}

			return {
				date,
				fromAccountId: b.fromAccountId,
				amount: offset,
			};
		});
}

function getUpcomingBudgetTransactions(budgets: Budget[], to: Date | null): Action[] {
	if(!to) {
		return [];
	}

	const toIso = to.toISOString();

	return budgets
	.map(b => {
		const [, end] = currentPeriod(b);

		return occurrancesInRange(b, end, toIso)
			.map(date => ({
				date,
				fromAccountId: b.fromAccountId,
				amount: b.amount,
			}));
	})
	.flat();

}

function getUpcomingRecurringTransactions(recurringTransactions: RecurringTransaction[], to: Date | null): Action[] {
	if(!to) {
		return [];
	}

	const toIso = to.toISOString();
	const fromIso = endOfToday().toISOString();
	return recurringTransactions.map(rt =>
			occurrancesInRange(rt, fromIso, toIso)
				.map(date => ({
					date,
					fromAccountId: rt.fromAccountId,
					towardAccountId: rt.towardAccountId,
					amount: rt.amount,
				})),
		)
		.flat();
}

async function getRelevantTransactions(accountId: string | undefined, from: string | undefined, to: Date | null) {
	return (accountId && from && to) ?
		await getAccountTransactionsInRange(accountId, from, to) :
		[];
}

function effectsToBalances(account: Account, transactions: Action[], date: string) {
	const relevantBalanceUpdate = account
		.balanceUpdateHistory
		.find(b => b.date <= date);

	if(!relevantBalanceUpdate) {
		return null;
	}

	const inRangeTransactions = transactions
		.filter(t => (
			t.date < endOfDay(new Date(date)).toISOString() &&
			t.date >= relevantBalanceUpdate.date
		));

	const fromDir = fromBalanceDirection(account.type);
	const towardDir = towardBalanceDirection(account.type);

	const fromAmount = inRangeTransactions
		.filter(t => t.fromAccountId === account.id)
		.reduce((prev, t) => prev + (t.amount * fromDir), 0);

	const towardAmount = inRangeTransactions
		.filter(t => t.towardAccountId === account.id)
		.reduce((prev, t) => prev + (t.amount * towardDir), 0);

	return relevantBalanceUpdate.balance + towardAmount + fromAmount;
}
