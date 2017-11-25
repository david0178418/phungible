import { action, computed, observable } from 'mobx';

import ProfileStorage from '../shared/profile-storage';

import Profile from '../stores/profile';

function createProfileMeta(appStore: AppStore, profile: Profile): ProfileMetaData {
	return {
		id: profile.id,
		name: profile.name,
	};
}

export default
class AppStore {
	@observable public currentProfile: Profile;
	@observable public isLoggedIn: boolean;
	@observable public profiles: ProfileMetaData[];
	@observable public remoteProfiles: ProfileMetaData[];
	@observable public username: string;
	@observable public showTransactionConfirmation: boolean;
	@computed get remoteOnlyProfiles() {
		return this.remoteProfiles
			.filter(
				(remoteProfile) =>
					!this.hasLocalProfileMeta(remoteProfile.id),
			);
	}

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
		const profile = createProfileMeta(this, this.currentProfile);

		if(this.isLoggedIn) {
			profile.owner = {
				username: this.username,
			};
		}

		this.profiles.push(profile);
		this.loadProfiles();
	}
	public async deleteProfile(profileId: string) {
		if(this.hasLocalProfileMeta(profileId)) {
			ProfileStorage.destroyProfile(profileId);
			this.removeProfileMeta(profileId);
		} else {
			await ProfileStorage.destroyRemoteProfile(profileId);
			this.removeRemoteProfileMeta(profileId);
		}
	}
	public async getProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		return Profile.deserialize(profileData);
	}
	public profileIsSynced(profileId: string) {
		return this.remoteProfiles.some((profile) => profile.id === profileId);
	}
	@action public async openProfile(profileId: string) {
		this.currentProfile = await this.getProfile(profileId);
		ProfileStorage.setCurrentActiveProfile(this.currentProfile.id);
	}
	@action public async loadProfiles() {
		this.profiles = observable(ProfileStorage.getLocalProfiles());

		if(this.isLoggedIn) {
			this.remoteProfiles = observable(await ProfileStorage.getRemoteProfiles());
		} else {
			this.remoteProfiles = observable([]);
		}
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	@action public removeProfileMeta(profileId: string) {
		this.profiles = this.profiles.filter(
			(profile) => profile.id !== profileId,
		);
	}
	@action public removeRemoteProfileMeta(profileId: string) {
		this.remoteProfiles = this.remoteProfiles.filter(
			(profile) => profile.id !== profileId,
		);
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
	public async sync(profileId: string) {
		await ProfileStorage.sync(profileId);

		if(!this.hasLocalProfileMeta(profileId)) {
			const profileMeta = this.remoteProfiles.find((profile) => profile.id === profileId);
			this.profiles.push(profileMeta);
			ProfileStorage.saveLocalProfiles(this.profiles);
		}
	}
	public hasLocalProfileMeta(profileId: string) {
		return this.profiles.some((profile) => profile.id === profileId);
	}
}
