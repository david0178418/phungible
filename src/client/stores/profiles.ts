import PouchStorage from '../shared/pouch-storage';
import Storage from '../shared/storage';
import generateUUID from '../shared/utils/generate-uuid';
import Account from './account';
import Budget from './budget';
import ScheduledTransaction from './scheduled-transaction';
import Transaction from './transaction';

const PROFILE_DATA_PREFIX = 'profile-data-';

export
interface Profile {
	id: string;
	name: string;
}

export default
class Profiles {
	public static findProfile(id: string) {
		if(!Profiles.profiles) {
			return null;
		}

		return Profiles.profiles.find((profile) => profile.id === id);
	}

	public static async getCurrentProfile() {
		const profiles = Profiles.getProfiles();

		if(!profiles.length) {
			Profiles.currentProfile = Profiles.createDefaultProfile();
			Profiles.profiles.push(Profiles.currentProfile);
			Profiles.saveProfiles();
			Profiles.saveCurrentProfile();
		} else {
			Profiles.currentProfile = Profiles.findProfile(Storage.getItem('lastProfileId'));
			Profiles.currentProfile = profiles[0];
			Profiles.saveCurrentProfile();
		}

		PouchStorage.openDb(Profiles.currentProfile.id);

		return Profiles.currentProfile;
	}

	public static async getProfileData(id: string) {
		let accounts: Account[];
		let budgets: Budget[];
		let scheduledTransactions: ScheduledTransaction[];
		let transactions: Transaction[];

		return Promise.all([
			PouchStorage.getAllType(Account.type).then((a) => accounts = a),
			PouchStorage
				.getAllType(Budget.type)
				.then((b) => budgets = b),
			PouchStorage
				.getAllType(ScheduledTransaction.type)
				.then((s) => scheduledTransactions = s),
			PouchStorage
				.getAllType(Transaction.type)
				.then((t) => transactions = t),
		])
		.then((values) => {
			return {
				accounts: values[0],
				budgets: values[1],
				id,
				scheduledTransactions: values[2],
				transactions: values[3],
			};
		});
	}

	public static getLastProfileId() {
		return Storage.getItem('lastProfileId');
	}

	public static saveCurrentProfileData(data: any) {
		Profiles.setProfileData(Profiles.currentProfile.id, data);
	}

	public static setProfileData(id: string, data: any) {
		Storage.setItem(`${PROFILE_DATA_PREFIX}${id}`, data);
	}

	public static getProfiles() {
		if(Profiles.profiles) {
			return Profiles.profiles;
		}

		Profiles.profiles = Storage.getItem('profiles');

		if(!(Profiles.profiles && Profiles.profiles.length)) {
			Profiles.profiles = [];
		}

		return Profiles.profiles;
	}

	public static saveProfiles() {
		Storage.setItem('profiles', Profiles.profiles);
	}

	public static saveCurrentProfile() {
		Storage.setItem('lastProfileId', Profiles.currentProfile.id);
	}

	private static profiles: Profile[] = null;
	private static currentProfile: Profile = null;

	private static createDefaultProfile() {
		return {
			id: generateUUID(),
			name: 'Default',
		};
	}
}

(window as any).Profiles = Profiles;
