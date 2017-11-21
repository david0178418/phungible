import { action, observable} from 'mobx';

import ProfileStorage from '../shared/profile-storage';
import Profile from '../stores/profile';

function createProfileMeta(appStore: AppStore, profile: Profile) {
	let owner;

	if(appStore.username) {
		owner = {
			username: appStore.username,
		};
	}

	appStore.profiles.push({
		id: profile.id,
		isLocal: true,
		isRemote: false,
		name: profile.name,
		owner,
	});
}

export default
class AppStore {
	@observable public currentProfile: Profile;
	@observable public isLoggedIn: boolean;
	@observable public profiles: ProfileMetaData[];
	@observable public remoteProfiles: ProfileMetaData[];
	@observable public username: string;
	@observable public showTransactionConfirmation: boolean;

	constructor(params: Partial<AppStore> = {}) {
		Object.assign(this, {
			currentProfile: new Profile(),
			username: localStorage.getItem('username') || '',
		}, params);

		this.loadProfiles();
	}
	@action public clearAllData() {
		// TODO Nuke all profiles
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
	}
	@action public async createProfile() {
		this.currentProfile = new Profile();
		createProfileMeta(this, this.currentProfile);
		await this.refreshProfiles();
		this.loadProfiles();
	}
	@action public async openProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		this.currentProfile = await Profile.deserialize(profileData);
	}
	public async refreshProfiles() {
		const updated = await ProfileStorage.updateRemoteProfiles();

		if(!updated) {
			return false;
		}

		ProfileStorage.updateLocalProfiles();
		return true;
	}
	@action public loadProfiles() {
		this.remoteProfiles = observable(ProfileStorage.getRemoteProfiles());
		this.profiles = observable(ProfileStorage.getLocalProfiles());
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	@action public handleLogin(username: string) {
		localStorage.setItem('username', username);
		this.username = username;
		this.isLoggedIn = true;

		if(this.refreshProfiles()) {
			this.loadProfiles();
		}
	}
	@action public handleLogout() {
		this.isLoggedIn = false;
	}
}
