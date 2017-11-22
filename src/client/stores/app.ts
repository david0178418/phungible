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
	@action public createProfile() {
		this.currentProfile = new Profile();
		createProfileMeta(this, this.currentProfile);
		this.loadProfiles();
	}
	@action public async openProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		this.currentProfile = await Profile.deserialize(profileData);
	}
	@action public async loadProfiles() {
		this.profiles = observable(ProfileStorage.getLocalProfiles());

		if(this.isLoggedIn) {
			this.remoteProfiles = observable(await ProfileStorage.getRemoteProfiles());
		}
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	@action public async handleLogin(username: string) {
		localStorage.setItem('username', username);
		this.username = username;
		this.isLoggedIn = true;

		this.loadProfiles();
	}
	@action public handleLogout() {
		this.isLoggedIn = false;
	}
}
