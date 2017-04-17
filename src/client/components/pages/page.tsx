import * as React from 'react';

type Props = {
	children?: any;
};

const style = {
	backgroundColor: 'white',
};

export default
function Page({children}: Props) {
	return (
		<div style={style}>
			{children}
		</div>
	);
}
