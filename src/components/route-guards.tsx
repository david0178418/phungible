import React, { useContext } from 'react';
import { ProfileContext, UserContext } from '@common/contexts';
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
		(negate && profile) ||
		(!negate && !profile)
	) {
		return noredirect ? (
			null
		) : (
			<Redirect
				to="/getting-started"
			/>
		);
	}

	return children;
}

export
function RegisteredUserLoginGuard(props: Props) {
	const {
		negate,
		noredirect,
		children,
	} = props;
	const user = useContext(UserContext);

	if(
		(negate && user?.email) ||
		(!negate && !user?.email)
	) {
		return noredirect ? (
			null
		) : (
			<Redirect
				to="/login"
			/>
		);
	}

	return children;
}
