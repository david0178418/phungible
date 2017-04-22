import * as React from 'react';

type Props = {
	children?: any;
	className?: string;
};

const style: any = {
	backgroundColor: 'white',
	height: '100vh',
	position: 'absolute',
	width: '100vw',
};

export default
function Page({children, className}: Props) {
	return (
		<div style={style} className={`page ${className}`}>
			{children}
		</div>
	);
}
