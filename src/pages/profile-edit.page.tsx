import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createProfile, saveDoc, getDoc } from '@common/api';
import { Collection, Profile } from '@common/interfaces';
import { EditPage } from '@components/edit-page';
import { useEditItem } from '@common/hooks';
import { canSaveProfile } from '@common/validations';
import { IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/react';
import { ProfileContext, UserContext, ActiveProfileSetterContext } from '@common/contexts';

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
				<IonButton expand="full" onClick={() => profile.id && activeProfileSetter(profile.id)}>
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
		</EditPage>
	);
}

export default ProfileEditPage;
