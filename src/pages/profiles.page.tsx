import React, { useContext } from 'react';
import {
	IonNote,
	IonLabel,
	IonBadge,
	IonText,
} from '@ionic/react';
import { alertController } from '@ionic/core';
import {
	Collection,
} from '@common/interfaces';
import { CollectionPageBody } from '@components/collection-page-body';
import { useProfileCollection } from '@common/hooks';
import { deleteDoc } from '@common/api';
import { ProfileContext } from '@common/contexts';

export
function ProfilesPage() {
	const collection = useProfileCollection();
	const activeProfile = useContext(ProfileContext);

	return (
		<CollectionPageBody
			label="Profiles"
			editPath="/profile"
			collection={collection}
			onItemDelete={async (profile) => {
				const alert = await alertController.create({
					header: `Delete "${profile.name}"`,
					message:`Permanently delete "${profile.name}"?`,
					buttons: [
						{
							text: 'Cancel',
							role: 'cancel',
							cssClass: 'secondary',
						}, {
							text: 'Okay',
							async handler() {
								profile.id && await deleteDoc(profile.id, Collection.Profiles);
							},
						},
					],
				});
		
				alert.present();
			}}
			itemRenderFn={(profile) => (
				<>
					<div>
						<IonLabel>
							{profile.name}
						</IonLabel>
						{profile.notes && (
							<IonNote>
								<em>
									{profile.notes}
								</em>
							</IonNote>
						)}
						{!!profile.sharedUsers.length && (
							<IonNote>
								<em>
									Shared with {profile.sharedUsers.join(', ')}
								</em>
							</IonNote>
						)}
					</div>
					{activeProfile?.id === profile.id && (
						<IonText slot="end">
								<IonBadge color="secondary">
									Current Profile
								</IonBadge>
						</IonText>
					)}
				</>
			)}
		/>
	);
}

export default ProfilesPage;
