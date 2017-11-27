import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import ActionSwapHorizontal from 'material-ui/svg-icons/action/swap-horiz';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import TextField from 'material-ui/TextField';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { createViewModel, IViewModel } from 'mobx-utils/lib/create-view-model';
import * as React from 'react';

import ProfileStorage from '../../shared/profile-storage';
import { dialogStyles, floatingActionButtonStyle } from '../../shared/styles';
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

function openConfirmRemoval(store: Store, deletionCandidate: ProfileMetaData) {
	store.deletionCandidate = deletionCandidate;
}

function closeEditDialog(store: Store) {
	store.editingProfile = null;
}

function openEditDialog(store: Store, openProfile?: ProfileMetaData) {
	openProfile = openProfile || observable(ProfileStorage.createDefaultProfileMeta());
	store.editingProfile = createViewModel(openProfile);
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
						let icon;
						const isOpen = currentProfileId === profile.id;
						const props: ProfileManagerOptionsProps = {
							onEdit: () => openEditDialog(store, profile),
						};

						if(!isOpen) {
							props.onOpenProfile = () => appStore.openProfile(profile.id);
							props.onRemove = () => openConfirmRemoval(store, profile);
						}

						if(appStore.isLoggedIn) {
							props.onSync = () => appStore.sync(profile.id);

							if(appStore.remoteProfiles.find((rP) => profile.id === rP.id)) {
								icon = <ActionSwapHorizontal/>;
							}
						}

						return (
							<ListItem
								key={profile.id}
								primaryText={profile.name}
								secondaryText={isOpen && 'active'}
								rightIconButton={ProfileManagerOptions(props)}
								leftIcon={icon}
							/>
						);
					})}
					{appStore.isLoggedIn && appStore.remoteOnlyProfiles.map((profile) => {
						const props: ProfileManagerOptionsProps = {
							onEdit: () => openEditDialog(store, profile),
						};

						props.onOpenProfile = () => appStore.openProfile(profile.id);
						props.onRemove = () => openConfirmRemoval(store, profile);
						props.onSync = () => appStore.sync(profile.id);

						return (
							<ListItem
								key={profile.id}
								primaryText={profile.name}
								rightIconButton={ProfileManagerOptions(props)}
								leftIcon={<FileCloud/>}
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
						<RaisedButton
							label="Cancel"
							onClick={() => closeConfirmRemoval(store)}
						/>,
						<RaisedButton
							primary
							label="Delete"
							onClick={() => this.handleDeleteProfile()}
						/>,
					]}
				/>
				<Dialog
					modal
					{...dialogStyles}
					open={!!editingProfile}
					title="Edit Profile Name"
					actions={[
						<RaisedButton
							label="Cancel"
							onClick={() => closeEditDialog(store)}
						/>,
						<RaisedButton
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

	private handleDeleteProfile() {
		this.props.appStore.deleteProfile(
			this.store.deletionCandidate.id,
		);
		this.store.deletionCandidate = null;
	}

	private handleSaveProfile() {
		if(!this.store.editingProfile.id) {
			this.props.appStore.createProfile(this.store.editingProfile.model.name);
		} else {
			this.store.editingProfile.submit();
			this.props.appStore.updateProfileMeta(this.store.editingProfile.model);
		}

		closeEditDialog(this.store);
	}

	private handleUpdateName(newName: string) {
		this.store.editingProfile.name = newName;
	}
}
