import * as React from 'react';

type Props = {
	children?: any;
	className?: string;
	style?: any;
};

const defaultStyle: any = {
	backgroundColor: 'white',
	height: '100vh',
	position: 'absolute',
	width: '100vw',
};

export default
function Page({children, className, style}: Props) {
	const computedStyle = Object.assign({}, defaultStyle, style);
	return (
		<div style={computedStyle} className={`page ${className}`}>
			{children}
		</div>
	);
}
