import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { createViewModel, IViewModel } from 'mobx-utils/lib/create-view-model';
import * as React from 'react';

import ProfileStorage from '../../shared/profile-storage';
import { dialogStyles, floatingActionButtonStyle } from '../../shared/styles';
import { generateUuid } from '../../shared/utils/index';
import AppStore from '../../stores/app';
import ProfileManagerOptions from './profile-manager-options';

const { Component } = React;

type ProfileMetaDataViewModel = ProfileMetaData & IViewModel<ProfileMetaData>;

class Store {
	@observable public deletionCandidate: ProfileMetaData | null = null;
	@observable public editingProfile: ProfileMetaDataViewModel | null = null;
}

interface Props {
	appStore?: AppStore;
}

function closeConfirmRemoval(store: Store) {
	store.deletionCandidate = null;
}

function createProfile(appStore: AppStore, profile: ProfileMetaData) {
	profile.id = generateUuid();
	appStore.profiles.push(profile);
}

function openConfirmRemoval(store: Store, deletionCandidate: ProfileMetaData) {
	store.deletionCandidate = null;
}

function closeEditDialog(store: Store) {
	store.editingProfile = null;
}

function updateProfile(store: Store) {
	store.editingProfile.submit();
	store.editingProfile = null;
}

function openEditDialog(store: Store, openProfile?: ProfileMetaData) {
	openProfile = openProfile || observable(ProfileStorage.createDefaultProfileMeta());
	store.editingProfile = createViewModel(openProfile);
}

function removalConfirmed(store: Store) {
	const deleteProfile = store.deletionCandidate;

	ProfileStorage.destroyProfile(deleteProfile.id);

	store.deletionCandidate = null;
}

@inject('appStore') @observer
export default
class ProfileManager extends Component<Props, {}> {
	private store: Store;

	constructor(props: Props) {
		super(props);

		this.store = new Store();
	}

	public render() {
		const appStore = this.props.appStore;
		// const loggedIn = appStore.isLoggedIn;
		const currentProfileId = appStore.currentProfile.id;
		const store = this.store;
		const {
			deletionCandidate,
			editingProfile,
		} = store;

		return (
			<div>
				<List>
					{appStore.profiles.map((profile) => {
						const isOpen = currentProfileId === profile.id;
						const props: ProfileManagerOptionsProps = {
							onEdit: () => openEditDialog(store, profile),
						};

						if(!isOpen) {
							props.onOpenProfile = () => appStore.openProfile(profile.id);
							props.onRemove = () => openConfirmRemoval(store, profile);
						}

						if(appStore.isLoggedIn) {
							props.onSync = () => ProfileStorage.sync(profile.id);
						}

						return (
							<ListItem
								key={profile.id}
								primaryText={profile.name}
								secondaryText={isOpen && 'active'}
								rightIconButton={ProfileManagerOptions(props)}
							/>
						);
					})}
				</List>
				<Dialog
					modal
					{...dialogStyles}
					open={!!deletionCandidate}
					title={deletionCandidate && `Deleting '${deletionCandidate.name}' will delete related entries. Delete?`}
					actions={[
						<FlatButton
							primary
							label="Cancel"
							onClick={() => closeConfirmRemoval(store)}
						/>,
						<FlatButton
							primary
							label="Delete"
							onClick={() => removalConfirmed(store)}
						/>,
					]}
				/>
				<Dialog
					modal
					{...dialogStyles}
					open={!!editingProfile}
					title="Edit Profile Name"
					actions={[
						<FlatButton
							label="Cancel"
							onClick={() => closeEditDialog(store)}
						/>,
						<FlatButton
							primary
							label="Save"
							onClick={() => this.handleSaveProfile()}
						/>,
					]}
				>
					{editingProfile && (
						<TextField
							id={editingProfile.id}
							value={editingProfile.name}
							onChange={(ev, newValue) => this.handleUpdateName(newValue)}
						/>
					)}
				</Dialog>
				<FloatingActionButton
					secondary
					onClick={() => openEditDialog(store)}
					style={floatingActionButtonStyle}
					zDepth={2}
				>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}

	private handleSaveProfile() {
		if(!this.store.editingProfile.id) {
			createProfile(this.props.appStore, this.store.editingProfile.model);
		}

		updateProfile(this.store);

		ProfileStorage.saveProfiles(this.props.appStore.profiles);
	}

	private handleUpdateName(newName: string) {
		this.store.editingProfile.name = newName;
	}
}
