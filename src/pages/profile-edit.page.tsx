import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createProfile, saveDoc, getDoc } from '../api';
import { Collection, Profile } from '../interfaces';
import { EditPage } from '../components/edit-page';
import { useEditItem } from '../hooks';
import { canSaveProfile } from '../validations';
import { IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/react';

export
function ProfileEditPage() {
	const [
		profile,
		setProfile,
		resetProfile,
		isValid,
	] = useEditItem(createProfile, canSaveProfile);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);


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
		if(!(isValid && profile)) {
			return;
		}

		const result = await saveDoc(profile, Collection.Profiles);
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
