import React, { useContext } from 'react';
import { ProfileContext } from '@common/contexts';
import { Redirect } from 'react-router-dom';

interface Props {
	negate?: boolean;
	noredirect?: boolean;
	children: JSX.Element;
}

export
function ActiveProfileGuard(props: Props) {
	const {
		negate,
		noredirect,
		children,
	} = props;
	const profile = useContext(ProfileContext);

	if(
		!noredirect && (
			(negate && profile) ||
			(!negate && !profile)
		)
	) {
		return (
			<Redirect
				to="/getting-started"
			/>
		);
	}

	return children;
}
