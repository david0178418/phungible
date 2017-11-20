import { action, observable} from 'mobx';

import ProfileStorage from '../shared/profile-storage';
import Profile from '../stores/profile';

export default
class AppStore {
	@observable public currentProfile: Profile;
	@observable public isLoggedIn: boolean;
	@observable public profiles: ProfileMetaData[];
	@observable public username: string;
	@observable public showTransactionConfirmation: boolean;

	constructor(params: Partial<AppStore> = {}) {
		Object.assign(this, {
			currentProfile: new Profile(),
			profiles: observable([]),
			username: localStorage.getItem('username') || '',
		}, params);
	}
	@action public clearAllData() {
		// TODO Nuke all profiles
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
	}
	@action public createProfile() {
		this.currentProfile = new Profile();
	}
	@action public async openProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		this.currentProfile = await Profile.deserialize(profileData);
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	@action public handleLogin(username: string) {
		window.localStorage.setItem('username', username);
		this.username = username;
		this.isLoggedIn = true;
	}
	@action public handleLogout() {
		this.isLoggedIn = false;
	}
}
