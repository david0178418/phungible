import React, {
} from 'react';
import {
	IonNote,
	IonLabel,
} from '@ionic/react';
import {
	Collection,
	Profile,
} from '../interfaces';
import { CollectionPage } from '../components/collection-page';

export
function ProfilesPage() {
	return (
		<CollectionPage
			collectionType={Collection.Profiles}
			label="Profiles"
			editPath="/profile"
			itemRenderFn={(profile: Profile) => (
				<>
					<div>
						<IonLabel>
							{profile.name}
						</IonLabel>
						{profile.sharedUsers.length && (
							<IonNote>
								<em>
									Shared with {profile.sharedUsers.join(', ')}
								</em>
							</IonNote>
						)}
					</div>
				</>
			)}
		/>
	);
}

export default ProfilesPage;
