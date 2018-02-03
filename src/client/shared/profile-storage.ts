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
		//
	}
	public static getAllType(type: string) {
		const docList = Storage.getItem(type);

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
	public static async getProfile(id: string) {
		return {
			...ProfileStorage.getDoc(id, Profile.type),
			accounts: ProfileStorage.getAllType(Account.type),
			budgets: ProfileStorage.getAllType(Budget.type),
			scheduledTransactions: ProfileStorage.getAllType(ScheduledTransaction.type),
			transactions: ProfileStorage.getAllType(Transaction.type),
		};
	}
	public static getKey(type: ItemType, profileId?: string) {
		return profileId ? `${profileId}:${type}` : type;
	}
	public static getLastProfileId() {
		return Storage.getItem('lastProfileId') || '';
	}
	public static removeDoc(doc: ProfileDoc, profileId: string) {
		const docList = Storage.getItem(ProfileStorage.getKey(doc.type, profileId));

		if(!docList) {
			return;
		}

		delete docList[doc.id];
		Storage.setItem(doc.type, docList);
	}
	public static save(profile: Profile) {
		ProfileStorage.saveDoc(profile, profile.id);
	}
	public static saveDoc(doc: ProfileDoc, profileId?: string) {
		const docList = Storage.getItem(ProfileStorage.getKey(doc.type, profileId)) || {};
		docList[doc.id] = doc.serialize();
		Storage.setItem(doc.type, docList);
	}
	public static setCurrentActiveProfile(profileId: string) {
		Storage.setItem('lastProfileId', profileId);
	}
}

(window as any).Profiles = ProfileStorage;
