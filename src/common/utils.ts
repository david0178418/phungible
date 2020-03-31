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
