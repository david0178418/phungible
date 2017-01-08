import * as React from 'react';

type IconProps = {
	type: string;
};

export
function Icon({type}: IconProps) {
	return (
		<span className={`fa fa-${type}`}></span>
	);
};
