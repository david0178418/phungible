import {clearItem, getItem, setItem} from '../shared/storage';
import generateUUID from '../shared/utils/generate-uuid';

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

	public static getCurrentProfile() {
		const profiles = Profiles.getProfiles();

		if(!profiles.length) {
			Profiles.currentProfile = Profiles.createDefaultProfile();
			Profiles.profiles.push(Profiles.currentProfile);
			Profiles.saveProfiles();
			Profiles.saveCurrentProfile();
		} else {
			Profiles.currentProfile = Profiles.findProfile(getItem('lastProfileId'));
			Profiles.currentProfile = profiles[0];
			Profiles.saveCurrentProfile();
		}

		return Profiles.currentProfile;
	}

	public static getProfileData(id: string) {
		return getItem(`${PROFILE_DATA_PREFIX}${id}`);
	}

	public static saveCurrentProfileData(data: any) {
		Profiles.setProfileData(Profiles.currentProfile.id, data);
	}

	public static setProfileData(id: string, data: any) {
		setItem(`${PROFILE_DATA_PREFIX}${id}`, data);
	}

	public static getProfiles() {
		if(Profiles.profiles) {
			return Profiles.profiles;
		}

		Profiles.profiles = getItem('profiles');

		if(!(Profiles.profiles && Profiles.profiles.length)) {
			Profiles.profiles = [];
		}

		return Profiles.profiles;
	}

	public static saveProfiles() {
		setItem('profiles', Profiles.profiles);
	}

	public static saveCurrentProfile() {
		setItem('lastProfileId', Profiles.currentProfile.id);
	}

	public static TEMPMigrateLegacyStoreToProfile() {
		const legacyStoreData = getItem('store');

		if(!legacyStoreData) {
			return;
		}

		const currentProfile = Profiles.getCurrentProfile();

		setItem(`${PROFILE_DATA_PREFIX}${currentProfile.id}`, legacyStoreData);
		clearItem('store');
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
