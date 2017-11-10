import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

import ProfileStorage from '../../shared/profile-storage';
import { dialogStyles } from '../../shared/styles';
import AppStore from '../../stores/app';
import ProfileManagerOptions from './profile-manager-options';

const { Component } = React;

class Store {
	@observable public deletionCandidate: ProfileMetaData | null = null;
}

interface Props {
	appStore?: AppStore;
}

function closeConfirmRemoval(store: Store) {
	store.deletionCandidate = null;
}

function openConfirmRemoval(store: Store, deletionCandidate: ProfileMetaData) {
	store.deletionCandidate = null;
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
		const { deletionCandidate } = store;

		return (
			<div>
				<List>
					{appStore.profiles.map((profile) => (
						<ListItem
							key={profile.id}
							primaryText={`${profile.name} ${(currentProfileId === profile.id) && 'active'}`}
							rightIconButton={
								ProfileManagerOptions({
									onRemove: () => openConfirmRemoval(store, profile),
								})
							}
						/>
					))}
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
							onClick={() => closeConfirmRemoval(this.store)}
						/>,
						<FlatButton
							primary
							label="Delete"
							onClick={() => removalConfirmed(this.store)}
						/>,
					]}
				/>
			</div>
		);
	}
}
