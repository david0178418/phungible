import {action, computed, observable} from 'mobx';
import * as moment from 'moment';
import {deserialize, identifier, list, object, primitive, reference, serializable, serialize} from 'serializr';

import {TransactionType} from '../constants';
import { getAccount, getBudget, getScheduledTransaction } from '../shared/utils/get-data-type';
import Money from '../shared/utils/money';
import Account from './account';
import Budget from './budget';
import ScheduledTransaction from './scheduled-transaction';

type Moment = moment.Moment;

export
interface TransactionEffect {
	accountId: string;
	amount: number;
	date: Date;
}

export
type TRANSACTION_TYPE = 'transaction';

export default
class Transaction {
	public static readonly type: TRANSACTION_TYPE = 'transaction';
	public static deserialize(data: any) {
		return new Promise((resolve, reject) => {
			deserialize(Transaction, data, (err: any, result: any) => {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}
	@action public static clone(originalTransaction: Transaction) {
		return Transaction.deserialize(serialize(originalTransaction));
	}
	@serializable
	public readonly type: TRANSACTION_TYPE = 'transaction';
	@serializable
	@observable public transactionType: TransactionType = TransactionType.Expense;
	@serializable(identifier())
	@observable public id: string;
	@serializable
	public profileId: string;
	@serializable(object(Money))
	public amount: Money;
	@serializable(reference(Account as any, getAccount as any))
	@observable public fromAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable(reference(Account as any, getAccount as any))
	@observable public towardAccount: Account | null = null;	// TODO Clean up setting and access
	@serializable
	@observable public needsConfirmation = false;
	@serializable
	@observable public notes = '';
	@serializable(list(primitive()))
	@observable public labels: string[];
	@serializable
	@observable public name = '';
	@serializable(reference(ScheduledTransaction as any, getScheduledTransaction as any))
	@observable public generatedFromSchedTrans: ScheduledTransaction | null = null;
	@serializable(reference(Budget as any, getBudget as any))
	@observable public generatedFromBudget: Budget | null = null;
	@serializable
	@observable private _dateString: string;

	constructor(params: Partial<Transaction> = {}) {
		const amount = params.amount ? params.amount.valCents : 0;
		return Object.assign(this, {
			_dateString: moment().format('MM/DD/YYYY'),
			amount: new Money(amount),
			labels: [],
		}, params);
	}

	set date(newDate: Date) {
		if(!isNaN(newDate.getTime())) {
			this._dateString = moment(newDate).format('MM/DD/YYYY');
		}
	}
	@computed get date() {
		return this.dateMoment.toDate();
	}
	@computed get dateMoment() {
		return moment(this._dateString, 'MM/DD/YYYY');
	}
	@computed get isValid() {
		const {Income} = TransactionType;
		return !!(this.name && (
			this.transactionType !== Income && this.fromAccount ||
			this.transactionType === Income && this.towardAccount
		));
	}

	@action public confirm() {
		this.date = new Date();
		this.needsConfirmation = false;
	}

	public affectsAccount(account: Account) {
		return (
			this.fromAccount && (this.fromAccount.id === account.id) ||
			this.towardAccount && (this.towardAccount.id === account.id)
		);
	}

	public affectOnDateRange(from: Date, to: Date): TransactionEffect[] {
		if(this.date > to) {
			return null;
		}

		const affects: TransactionEffect[] = [];

		if(this.fromAccount) {
			affects.push({
				accountId: this.fromAccount.id,
				amount: this.amount.valCents * this.fromAccount.fromBalanceDirection,
				date: this.date,
			});
		}

		if(this.towardAccount) {
			affects.push({
				accountId: this.towardAccount.id,
				amount: this.amount.valCents * this.towardAccount.towardBalanceDirection,
				date: this.date,
			});
		}

		return affects;
	}
	public occursOn(date: Date | Moment) {
		return this.dateMoment.isSame(date, 'day');
	}

	public serialize() {
		return serialize(this);
	}
}
