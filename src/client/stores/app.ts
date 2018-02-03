import { action, computed, observable } from 'mobx';

import ProfileStorage from '../shared/profile-storage';
import Profile, { ProfileMeta } from '../stores/profile';

export default
class AppStore {
	@observable public currentProfile: Profile;
	@observable public profileMetas: ProfileMeta[];
	@observable public showTransactionConfirmation: boolean;
	@computed get currentProfileMeta() {
		return this.findProfileMeta(this.currentProfile.id) || {} as ProfileMeta;
	}
	constructor(params: Partial<AppStore> = {}) {
		Object.assign(this, params);

		this.init();
	}
	@action public async openLastProfile() {
		const lastProfile = ProfileStorage.getLastProfileId();
		await this.openProfile(lastProfile);
	}
	@action public clearAllData() {
		// TODO Nuke all profiles
	}
	@action public createProfile(name?: string) {
		this.currentProfile = new Profile();
		const meta = this.currentProfile.getMeta();

		if(name) {
			this.currentProfile.name = name;
		}

		ProfileStorage.saveDoc(meta);
		this.profileMetas.push(meta);
	}
	public async deleteProfile(profileId: string) {
		ProfileStorage.destroyProfile(profileId);
		this.removeProfileMeta(profileId);
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
	}
	public findProfileMeta(profileId: string) {
		return this.profileMetas.find((profile) => profile.id === profileId);
	}
	public async getProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfile(profileId);
		return Profile.deserialize(profileData);
	}
	@action public async openProfile(profileId: string) {
		this.currentProfile = await this.getProfile(profileId);
		ProfileStorage.setCurrentActiveProfile(this.currentProfile.id);
	}
	@action public async loadProfiles() {
		this.profileMetas = observable(ProfileStorage.getAllType(Profile.type));
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	@action public removeProfileMeta(profileId: string) {
		this.profileMetas = this.profileMetas.filter(
			(profile) => profile.id !== profileId,
		);
	}
	public async reloadProfile() {
		this.currentProfile = await this.getProfile(this.currentProfileMeta.id);
	}
	public updateProfileMeta(profile: ProfileMeta) {
		ProfileStorage.saveDoc(profile);
	}
	public hasLocalProfileMeta(profileId: string) {
		return !!this.findProfileMeta(profileId);
	}
	private async init() {
		this.loadProfiles();
		await this.openLastProfile();
		this.currentProfile.runTransactionSinceLastUpdate();
	}
}
