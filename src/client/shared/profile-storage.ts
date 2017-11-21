import { getRemoteProfiles } from '../shared/api';
import PouchStorage, { PouchDocument } from '../shared/pouch-storage';
import Storage from '../shared/storage';
import generateUUID from '../shared/utils/generate-uuid';
import Account from '../stores/account';
import Budget from '../stores/budget';
import ScheduledTransaction from '../stores/scheduled-transaction';
import Transaction from '../stores/transaction';

let activeProfileDB: PouchDB.Database;

const LOCAL_PROFILE_METADATA_KEY = 'profiles-local';
const REMOTE_PROFILE_METADATA_KEY = 'profiles-remote';

export default
class ProfileStorage {
	public static destroyCurrentProfile() {
		return activeProfileDB.destroy();
	}
	public static destroyProfile(id: string) {
		return PouchStorage.deleteDb(id);
	}
	public static async getCurrentProfileMeta() {
		let loadedProfile = null;
		const profiles = ProfileStorage.getLocalProfiles();

		if(!profiles.length) {
			const defaultProfile = ProfileStorage.createDefaultProfileMeta();
			defaultProfile.id = generateUUID();

			ProfileStorage.saveLocalProfiles([defaultProfile]);
			ProfileStorage.setCurrentActiveProfile(defaultProfile.id);

			loadedProfile = defaultProfile;
		} else {
			const lastLoadedId = ProfileStorage.getLastProfileId();
			loadedProfile = profiles.find((profile) => profile.id === lastLoadedId);

			if(!loadedProfile) {
				loadedProfile = profiles[0];
			}
		}

		return loadedProfile || null;
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
	public static getLocalProfiles(): ProfileMetaData[] {
		return Storage.getItem(LOCAL_PROFILE_METADATA_KEY) || [];
	}
	public static getRemoteProfiles(): ProfileMetaData[] {
		return Storage.getItem(REMOTE_PROFILE_METADATA_KEY) || [];
	}
	public static async updateRemoteProfiles() {
		try {
			let remoteProfiles = await getRemoteProfiles();
			remoteProfiles = remoteProfiles.map((profile) => {
				profile.isRemote = true;
				profile.isLocal = false;
				return profile;
			});

			ProfileStorage.saveRemoteProfiles(remoteProfiles);
			return true;
		} catch {
			return false;
		}
	}
	public static updateLocalProfiles() {
		const remoteProfiles = ProfileStorage.getRemoteProfiles();
		const localProfiles = ProfileStorage.getLocalProfiles();
		const updatedLocalProfiles = localProfiles
			.filter(
				(profileMeta) => {
					const isSynced = !remoteProfiles.some((v) => v.id === profileMeta.id);

					profileMeta.isRemote = isSynced;
					profileMeta.isLocal = false;

					return isSynced;
				},
			)
			.concat(remoteProfiles);

		ProfileStorage.saveLocalProfiles(updatedLocalProfiles);
	}
	public static removeDoc(doc: PouchDocument) {
		PouchStorage.removeDoc(doc, activeProfileDB);
	}
	public static async sync(profileId: string) {
		PouchStorage.sync(profileId);
	}
	public static saveDoc(doc: PouchDocument) {
		PouchStorage.saveDoc(doc, activeProfileDB);
	}
	public static saveLocalProfiles(profiles: ProfileMetaData[]) {
		Storage.setItem(LOCAL_PROFILE_METADATA_KEY, profiles);
	}
	public static saveRemoteProfiles(profiles: ProfileMetaData[]) {
		Storage.setItem(REMOTE_PROFILE_METADATA_KEY, profiles);
	}
	public static setCurrentActiveProfile(profileId: string) {
		Storage.setItem('lastProfileId', profileId);
	}
	public static createDefaultProfileMeta() {
		return {
			id: '',
			isLocal: true,
			isRemote: false,
			name: 'My Profile',
		};
	}
}

(window as any).Profiles = ProfileStorage;
