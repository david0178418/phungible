import React, { useContext } from 'react';
import { ProfileContext } from '@common/contexts';

import './profile-tag.scss';
import { IonBadge } from '@ionic/react';

export
function ProfileTag() {
	const profile = useContext(ProfileContext);

	if(!profile) {
		return null;
	}

	return (
		<div className="profile-name-tag">
			<IonBadge color="tertiary">
				Profile: {profile.name}
			</IonBadge>
		</div>
	);
}
