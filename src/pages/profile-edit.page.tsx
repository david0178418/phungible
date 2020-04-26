import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { saveDoc, getDoc, getUsername } from '@common/api';
import { Collection, Profile } from '@shared/interfaces';
import { EditPage } from '@components/edit-page';
import { useEditItem } from '@common/hooks';
import { canSaveProfile } from '@common/validations';
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonList, IonIcon } from '@ionic/react';
import { ProfileContext, UserContext, ActiveProfileSetterContext } from '@common/contexts';
import { alertController, loadingController } from '@ionic/core';
import { personRemoveOutline } from 'ionicons/icons';
import { filterKeys } from '@shared/utils';
import { createProfile } from '@shared/create-docs';

export
function ProfileEditPage() {
	const [
		profile,
		setProfile,
		resetProfile,
		isValid,
	] = useEditItem(createProfile, canSaveProfile);
	const user = useContext(UserContext);
	const activeProfile = useContext(ProfileContext);
	const activeProfileSetter = useContext(ActiveProfileSetterContext);
	const [newUser, setNewUser] = useState('');
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);
	const isActiveProfile = activeProfile?.id === profile.id;

	function updateProp<T extends keyof Profile>(prop: T, newVal: Profile[T]) {
		setProfile({
			...profile,
			[prop]: newVal,
		});
	}

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Profile>(`${Collection.Profiles}/${id}`);
				if(a) {
					resetProfile({...a});
				}
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleSubmit() {
		if(!(isValid && profile && user?.uid)) {
			return;
		}

		const result = await saveDoc<Profile>({
			...profile,
			ownerId: user?.uid,
		}, Collection.Profiles);
		result && goBack();
	}

	async function handleAddUser() {
		const loader = await loadingController.create({});
		await loader.present();

		const u = await getUsername(newUser);

		if(u?.display) {
			setProfile({
				...profile,
				sharedUsers: {
					...profile.sharedUsers,
					[u.ownerId]: {
						username: u.display,
					},
				},
			});
			setNewUser('');
		} else {
			const alert = await alertController.create({
				header: 'Does not exist',
				message: `User "${newUser}" does not exist.`,
				buttons: [
					{
						text: 'Ok',
						role: 'cancel',
					},
				],
			});

			alert.present();
		}

		loader.dismiss();
	}

	function handleRemoveUser(userId: string) {
		setProfile({
			...profile,
			sharedUsers: filterKeys(profile.sharedUsers, userId),
		});
	}

	function setActiveProfile() {
		profile.id && activeProfileSetter(profile.id);
		goBack();
	}

	return (
		<EditPage
			defaultHref="/profiles"
			canSave={isValid}
			editing={!!id}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<IonItem>
				<IonLabel position="stacked">
					Name
				</IonLabel>
				<IonInput
					placeholder="Profile Name"
					value={profile.name}
					onIonChange={({detail}) => {
						typeof detail.value === 'string' &&
						updateProp('name', detail.value);
					}}
				/>
			</IonItem>

			{profile.id && isActiveProfile && (
				<IonButton expand="full" disabled color="medium">
					"{profile.name}" is the open profile
				</IonButton>
			)}
			{profile.id && !isActiveProfile && (
				<IonButton expand="full" onClick={setActiveProfile}>
					Switch to profile "{profile.name}"
				</IonButton>
			)}

			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonTextarea
					placeholder="Enter Notes"
					value={profile.notes}
					onIonChange={({detail}) => updateProp('notes', detail.value || '')}
				/>
			</IonItem>

			<IonItem>
				<IonLabel position="stacked">
					Add User
				</IonLabel>
				<IonInput value={newUser} onIonChange={({detail}) => setNewUser(detail.value || '')}/>
			</IonItem>
			<IonButton expand="full" disabled={!newUser} onClick={handleAddUser}>
				Add User
			</IonButton>
			<IonList>
				{Object.entries(profile.sharedUsers).map(([uId, u]) => (
					<IonItem key={u.username} onClick={() => handleRemoveUser(uId)}>
						<IonLabel>
							{u.username}
						</IonLabel>
						<IonIcon icon={personRemoveOutline} color="danger" />
					</IonItem>
				))}
			</IonList>
		</EditPage>
	);
}

export default ProfileEditPage;
