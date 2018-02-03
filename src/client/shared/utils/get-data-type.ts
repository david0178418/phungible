import { deserialize } from 'serializr';
import ProfileStorage from '../profile-storage';

export
async function getAccount(id: string, callback: (err: any, result: any) => void) {
	getType(Account, id, callback);
}

export
async function getBudget(id: string, callback: (err: any, result: any) => void) {
	getType(Budget, id, callback);
}

export
async function getScheduledTransaction(id: string, callback: (err: any, result: any) => void) {
	getType(ScheduledTransaction, id, callback);
}

export
async function getType(Model: any, id: string, callback: (err: any, result: any) => void) {
	try {
		const data = await ProfileStorage.getDoc(id, Model.type);
		deserialize(Model, data, callback);
	} catch(e) {
		callback(e, null);
	}
}

import Account from '../../stores/account';
import Budget from '../../stores/budget';
import ScheduledTransaction from '../../stores/scheduled-transaction';
