import { toastController } from '@ionic/core';

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
	return numberFormat(decimalAmount, decimalPlaces);
}

export
function findById<T extends {id?: string}>(id: string, accounts: T[]) {
	return accounts.find(a => a.id === id);
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
