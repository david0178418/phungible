import { deserialize } from 'serializr';
import ProfileStorage from '../profile-storage';

export
async function getAccount(id: string, callback: (err: any, result: any) => void, ctx: any) {
	getType(Account, id, callback, ctx.target.profileId);
}

export
async function getBudget(id: string, callback: (err: any, result: any) => void, ctx: any) {
	getType(Budget, id, callback, ctx.target.profileId);
}

export
async function getScheduledTransaction(id: string, callback: (err: any, result: any) => void, ctx: any) {
	getType(ScheduledTransaction, id, callback, ctx.target.profileId);
}

export
async function getType(Model: any, id: string, callback: (err: any, result: any) => void, profileId?: string) {
	try {
		const data = await ProfileStorage.getDoc(id, Model.type, profileId);
		deserialize(Model, data, callback);
	} catch(e) {
		callback(e, null);
	}
}

import Account from '../../stores/account';
import Budget from '../../stores/budget';
import ScheduledTransaction from '../../stores/scheduled-transaction';
