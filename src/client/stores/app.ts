import { action, computed, observable } from 'mobx';

import ProfileStorage from '../shared/profile-storage';
import Storage from '../shared/storage';
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

		Promise.all([
			import('../shared/utils/recur-types'),
			import('./transaction'),
		]).then(() => {
			setTimeout(() => this.init(), 50);
		});
	}
	@action public async openLastProfile() {
		const lastProfile = ProfileStorage.getLastProfileId();
		if(lastProfile) {
			await this.openProfile(lastProfile);
		} else {
			await this.createDefaultProfile();
		}
	}
	@action public clearAllData() {
		Storage.clearAll();
		this.init();
	}
	@action public createDefaultProfile(name?: string) {
		this.currentProfile = new Profile();
		const meta = this.currentProfile.getMeta();

		if(name) {
			this.currentProfile.name = name;
		}

		ProfileStorage.saveDoc(meta);
		this.profileMetas.push(meta);
		ProfileStorage.setActiveProfile(this.currentProfile.id);
	}
	public async deleteProfile(profileId: string) {
		ProfileStorage.destroyProfile(profileId);
		this.loadProfileMetas();
	}
	@action public dismissTransactionConfirmation() {
		this.showTransactionConfirmation = false;
	}
	public findProfileMeta(profileId: string) {
		return this.profileMetas.find((profile) => profile.id === profileId);
	}
	public async getProfile(profileId: string) {
		const profileData = await ProfileStorage.getProfileData(profileId);
		return Profile.deserialize(profileData);
	}
	@action public async openProfile(profileId: string) {
		this.currentProfile = await this.getProfile(profileId);
		ProfileStorage.setActiveProfile(this.currentProfile.id);
	}
	@action public async loadProfileMetas() {
		this.profileMetas = observable(
			ProfileStorage
				.getAllType(Profile.type)
				.map((meta) => new ProfileMeta(meta)),
		);
	}
	@action public openTransactionConfirmation() {
		this.showTransactionConfirmation = true;
	}
	public async reloadProfile() {
		this.currentProfile = await this.getProfile(this.currentProfileMeta.id);
	}
	public updateProfileMeta(profile: ProfileMeta) {
		ProfileStorage.saveDoc(profile);
		this.loadProfileMetas();
	}
	public hasLocalProfileMeta(profileId: string) {
		return !!this.findProfileMeta(profileId);
	}
	private async init() {
		Storage.init();
		this.loadProfileMetas();
		await this.openLastProfile();
		this.currentProfile.runTransactionSinceLastUpdate();
	}
}
