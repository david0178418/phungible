import React, { useContext } from 'react';
import { ProfileContext } from '@common/contexts';
import { Redirect } from 'react-router-dom';

interface Props {
	negate?: boolean;
	children: JSX.Element;
}

export
function ActiveProfileGuard(props: Props) {
	const {
		negate,
		children,
	} = props;
	const profile = useContext(ProfileContext);

	return (
		(profile && !negate) ?
			children : (
			<Redirect
				to="/getting-started"
			/>
		)
	);
}
