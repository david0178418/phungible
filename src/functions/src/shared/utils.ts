import { toastController } from '@ionic/core';
import { parseISO, differenceInDays, addDays } from 'date-fns';

export
function range(startValue: number, size: number) {
	return [ ...Array(size - startValue + 1).keys() ].map( i => i +startValue );
}

export
function tuple<T extends any[]>(...args: T): T {
	return args;
}

export
function numberFormat(num: number, decimalPlaces: number) {
	return num / Math.pow(10, decimalPlaces);
}

export
function moneyFormat(intAmount: number, decimalPlaces = 2) {
	return numberFormat(intAmount, decimalPlaces);
}

export
function moneyParse(decimalAmount: number, decimalPlaces = -2) {
	return Math.round(numberFormat(decimalAmount, decimalPlaces));
}

export
function findById<T extends {id?: string}>(id: string, accounts: T[]) {
	return accounts.find(a => a.id === id);
}

export
function first<T>(list: T[]) {
	return list[0] || null;
}

export
function last<T>(list: T[]) {
	return list[list.length - 1] || null;
}

export
async function presentToast(message: string) {
	const toast = await toastController.create({
		message,
		duration: 3000,
		buttons: [{
			text: 'Dismiss',
			role: 'close',
		}],
	});

	await toast.present();
}

export
function filterKeys<T>(obj: T, keys: keyof T | Array<keyof T>) {
	const filteredKeys = Array.isArray(keys) ? keys: [keys];
	const objectKeys = Object.keys(obj) as Array<keyof T>;
	const keepKeys = objectKeys.filter(k => !filteredKeys.includes(k));

	return keepKeys
		.reduce((newObj, key) => ({ ...newObj, [key]: obj[key] }), {});
}

export
function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		// eslint-disable-next-line eqeqeq, no-mixed-operators
		const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

export
function pick<T extends object, U extends keyof T>(obj: T, paths: Array<U>): Partial<T> {
	return paths.reduce((o, k) => {
		o[k] = obj[k];
		return o;
	}, Object.create(null));
}

export
function dynamicallyLoadScript(url: string, onLoad?: () => any) {
	const script = document.createElement('script');
	script.src = url;
	script.async = true;

	if(onLoad) {
		script.onload = onLoad;
	}

	document.body && document.body.appendChild(script);
}

export
function dateRange(from: Date | string, to: Date | string) {
	const fromDate = from instanceof Date ? from : parseISO(from);
	const toDate = to instanceof Date ? to : parseISO(to);

	return range(0, Math.abs(differenceInDays(fromDate, toDate)))
		.map((val, i) => addDays(fromDate, i));
}

export
function notNull<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}
