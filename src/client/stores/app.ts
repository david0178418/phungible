import { action, computed, observable } from 'mobx';

import { getUserContext } from '../shared/api';
import ProfileStorage from '../shared/profile-storage';
import Profile from '../stores/profile';

export default
class AppStore {
	@observable public currentProfile: Profile;
	@observable public isOnline: boolean;
	@observable public profiles: ProfileMetaData[];
	@observable public remoteProfiles: ProfileMetaData[];
	@observable public username: string;
	@observable public sessionValid: boolean;
	@observable public showTransactionConfirmation: boolean;
	@computed get remoteOnlyProfiles() {
		return this.remoteProfiles
			.filter(
				(remoteProfile) =>
					!this.hasLocalProfileMeta(remoteProfile.id),
			);
	}
	@computed get currentProfileMeta() {
		return this.findProfileMeta(this.currentProfile.id) || {} as ProfileMetaData;
	}
	@computed get isConnected() {
		return this.isOnline && this.sessionValid;
	}
	constructor(params: Partial<AppStore> = {}) {
		Object.assign(this, {
			currentProfile: new Profile(),
			isOnline: navigator.onLine,
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
	@action public createProfile(name?: string) {
		this.currentProfile = new Profile();

		if(name) {
			this.currentProfile.name = name;
		}

		const profile = this.createProfileMeta();
		ProfileStorage.saveMeta(profile.id, {
			name: profile.name,
		});
		this.profiles.push(profile);
		this.loadProfiles();
	}
	@action public checkOnlineStatus() {
		this.isOnline = navigator.onLine;
	}
	@action public async checkSessionStatus() {
		try {
			const userCtx = await getUserContext();

			this.sessionValid = !!userCtx.name;
		} catch {
			this.sessionValid = false;
		}
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
	public findProfileMeta(profileId: string) {
		return this.profiles.find((profile) => profile.id === profileId);
	}
	public async getProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		return Profile.deserialize(profileData);
	}
	public profileIsSynced(profileId: string) {
		return !!this.remoteProfiles.find((profile) => profile.id === profileId);
	}
	@action public async openProfile(profileId: string) {
		if(this.isConnected) {
			await this.sync(profileId);
		}

		this.currentProfile = await this.getProfile(profileId);
		ProfileStorage.setCurrentActiveProfile(this.currentProfile.id);
	}
	@action public async loadProfiles() {
		this.profiles = observable(ProfileStorage.getLocalProfiles());

		if(this.sessionValid) {
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
	@action public async login(username: string) {
		localStorage.setItem('username', username);
		this.username = username;
		this.sessionValid = true;
		this.loadProfiles();
	}
	@action public logout() {
		this.sessionValid = false;
	}
	public async reloadProfile() {
		return this.openProfile(this.currentProfileMeta.id);
	}
	public async sync(profileId: string, handler?: () => void) {
		const updated = await ProfileStorage.sync(profileId);

		if(!this.hasLocalProfileMeta(profileId)) {
			const profileMeta = this.remoteProfiles.find((profile) => profile.id === profileId);
			this.profiles.push(profileMeta);
			ProfileStorage.saveLocalProfiles(this.profiles);
		}

		if(updated) {
			this.reloadProfile();
		}
	}
	public updateProfileMeta(profile: ProfileMetaData) {
		ProfileStorage.saveMeta(profile.id, {
			name: profile.name,
		});
		ProfileStorage.saveLocalProfiles(this.profiles);
	}
	public hasLocalProfileMeta(profileId: string) {
		return !!this.findProfileMeta(profileId);
	}
	private createProfileMeta(): ProfileMetaData {
		return {
			id: this.currentProfile.id,
			name: this.currentProfile.name,
		};
	}
}
