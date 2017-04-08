import * as accounting from 'accounting';
import {computed, observable} from 'mobx';
import {serializable} from 'serializr';

export
enum Unit {
	Dollars,
	Cents,
}

export default
class Money {
	public static Unit = Unit;
	public static roundNearest(val: number) {
		return Math.floor(val + 0.5);
	}
	public static formatMoney(val: number, precision: number = 2) {
		return accounting.formatMoney(val, {
			precision,
		});
	}
	@serializable
	@observable private totalValCents: number;

	@computed get cents() {
		return Money.roundNearest(this.totalValCents % 100);
	}

	set cents(val) {
		this.totalValCents = this.dollars * 100 + Money.roundNearest(val);
	}

	@computed get dollars() {
		return (this.totalValCents / 100) | 0;
	}

	set dollars(val) {
		this.totalValCents = (val * 100) + this.cents;
	}

	@computed get val() {
		return this.totalValCents / 100;
	}

	@computed get valCents() {
		return this.totalValCents;
	}

	@computed get valFormatted() {
		return Money.formatMoney(this.val);
	}

	constructor(val?: number) {
		this.totalValCents = val || 0;
	}

	public addCents(addedCentVal: number) {
		this.totalValCents = Money.roundNearest(this.totalValCents + addedCentVal);
	}

	public addDollars(addedDollarVal: number) {
		const cents = Money.roundNearest(addedDollarVal) * 100;
		return this.addCents(cents);
	}

	public set(newVal: number | string, unit: Unit = Unit.Dollars) {
		newVal = accounting.unformat(newVal as any);
		if(unit === Unit.Dollars) {
			newVal = newVal * 100;
		}

		this.totalValCents = Money.roundNearest(newVal);
	}
}
