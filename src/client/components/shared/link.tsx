import * as React from 'react';

type Props = {
	children?: any;
	style?: object;
	to: string;
};

export default
function Link(props: Props) {
	const {children, to} = props;
	return (
		<a href={`#${to}`} style={props.style}>
			{children}
		</a>
	);
}
