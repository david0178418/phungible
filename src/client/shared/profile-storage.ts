import Storage from '../shared/storage';
import Account from '../stores/account';
import Budget from '../stores/budget';
import Profile from '../stores/profile';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Transaction from '../stores/transaction';
import { ItemType } from '../types';

export
interface ProfileDoc {
	id: string;
	type: ItemType;
	parent?: string;
	serialize(): any;
}

export default
class ProfileStorage {
	public static destroyProfile(id: string) {
		const profile = new Profile(ProfileStorage.getDoc(id, Profile.type));
		ProfileStorage.removeDoc(profile);
		ProfileStorage.removeAllType(Account.type, id);
		ProfileStorage.removeAllType(Budget.type, id);
		ProfileStorage.removeAllType(ScheduledTransaction.type, id);
		ProfileStorage.removeAllType(Transaction.type, id);
	}
	public static getAllType(type: ItemType, profileId?: string) {
		const key = ProfileStorage.getKey(type, profileId);
		const docList = Storage.getItem(key);

		if(!docList) {
			return [];
		}

		return Object.keys(docList).map((docId) => docList[docId]);
	}
	public static removeAllType(type: ItemType, profileId: string) {
		Storage.removeItem(ProfileStorage.getKey(type, profileId));
	}
	public static getDoc(docId: string, type: ItemType, profileId?: string) {
		const docList = Storage.getItem(ProfileStorage.getKey(type, profileId));

		if(!docList) {
			return null;
		}

		return docList[docId];
	}
	public static async getProfileData(id: string) {
		return {
			...ProfileStorage.getDoc(id, Profile.type),
			accounts: ProfileStorage.getAllType(Account.type, id),
			budgets: ProfileStorage.getAllType(Budget.type, id),
			scheduledTransactions: ProfileStorage.getAllType(ScheduledTransaction.type, id),
			transactions: ProfileStorage.getAllType(Transaction.type, id),
		};
	}
	public static getKey(type: ItemType, profileId?: string) {
		return profileId ? `${profileId}:${type}` : type;
	}
	public static getLastProfileId() {
		return Storage.getItem('lastProfileId') || '';
	}
	public static removeDoc(doc: ProfileDoc, profileId?: string) {
		const key = ProfileStorage.getKey(doc.type, profileId);
		const docList = Storage.getItem(key);

		if(!docList) {
			return;
		}

		delete docList[doc.id];
		Storage.setItem(key, docList);
	}
	public static saveDoc(doc: ProfileDoc, profileId?: string) {
		const key = ProfileStorage.getKey(doc.type, profileId);
		const docList = Storage.getItem(key) || {};
		docList[doc.id] = doc.serialize();
		Storage.setItem(key, docList);
	}
	public static setActiveProfile(profileId: string) {
		Storage.setItem('lastProfileId', profileId);
	}
}

(window as any).ProfileStorage = ProfileStorage;
