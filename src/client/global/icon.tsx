import * as React from 'react';

type Props = {
	type: string;
};

export default
function Icon({type}: Props) {
	return (
		<span className={`fa fa-${type}`}></span>
	);
};
