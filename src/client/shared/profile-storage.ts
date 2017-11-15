import { getSyncedProfiles } from '../shared/api';
import PouchStorage, { PouchDocument } from '../shared/pouch-storage';
import Storage from '../shared/storage';
import generateUUID from '../shared/utils/generate-uuid';
import Account from '../stores/account';
import Budget from '../stores/budget';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Transaction from '../stores/transaction';

let activeProfileDB: PouchDB.Database;

export default
class Profiles {
	public static destroyCurrentProfile() {
		return activeProfileDB.destroy();
	}
	public static destroyProfile(id: string) {
		return PouchStorage.deleteDb(id);
	}
	public static async getCurrentProfileMeta() {
		let loadedProfile = null;
		const profiles = Profiles.getProfiles();

		if(!profiles.length) {
			const defaultProfile = Profiles.createDefaultProfileMeta();
			defaultProfile.id = generateUUID();

			Profiles.saveProfiles([defaultProfile]);
			Profiles.setCurrentActiveProfile(defaultProfile.id);

			loadedProfile = defaultProfile;
		} else {
			const lastLoadedId = Profiles.getLastProfileId();
			loadedProfile = profiles.find((profile) => profile.id === lastLoadedId);
		}

		return loadedProfile;
	}
	public static getDoc(docId: string) {
		PouchStorage.getDoc(docId, activeProfileDB);
	}
	public static async getProfileData(id: string) {
		let info: any = {};

		if(activeProfileDB) {
			info = await activeProfileDB.info();
		}

		if(info.db_name !== `profile-${id}`) {
			if(activeProfileDB) {
				activeProfileDB.close();
			}

			activeProfileDB = await PouchStorage.openDb(id);
		}

		const values = await Promise.all([
			PouchStorage
				.getAllType(Account.type, activeProfileDB),
			PouchStorage
				.getAllType(Budget.type, activeProfileDB),
			PouchStorage
				.getAllType(ScheduledTransaction.type, activeProfileDB),
			PouchStorage
				.getAllType(Transaction.type, activeProfileDB),
		]);

		return {
			accounts: values[0],
			budgets: values[1],
			id,
			scheduledTransactions: values[2],
			transactions: values[3],
			...values[4],
		};
	}
	public static getLastProfileId() {
		return Storage.getItem('lastProfileId');
	}
	public static getProfiles(): ProfileMetaData[] {
		return Storage.getItem('profiles') || [];
	}
	public static async refreshProfiles() {
		try {
			Profiles.saveProfiles(await getSyncedProfiles());
			return true;
		} catch {
			return false;
		}
	}
	public static removeDoc(doc: PouchDocument) {
		PouchStorage.removeDoc(doc, activeProfileDB);
	}
	public static async sync(onChange?: () => void) {
		const profiles = await getSyncedProfiles();
		// TODO get the profile id straight from the db instance
		const profileId = Profiles.getLastProfileId();

		if(profiles.indexOf(profileId) !== -1) {
			PouchStorage.sync(activeProfileDB, onChange);
		}
	}
	public static saveDoc(doc: PouchDocument) {
		PouchStorage.saveDoc(doc, activeProfileDB);
	}
	public static saveProfiles(profiles: ProfileMetaData[]) {
		Storage.setItem('profiles', profiles);
	}
	public static setCurrentActiveProfile(profileId: string) {
		Storage.setItem('lastProfileId', profileId);
	}

	public static createDefaultProfileMeta() {
		return {
			id: '',
			isSynced: false,
			name: 'My Profile',
		};
	}
}

(window as any).Profiles = Profiles;
