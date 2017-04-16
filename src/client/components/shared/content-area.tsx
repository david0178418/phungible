import * as React from 'react';

const BOTTOM_PADDING = 80;
const HEADING_HEIGHT = 64;

type Props = {
	children?: any;
};

export default
function ContentArea({children}: Props) {
	return (
		<div style={{
			maxHeight: `calc(100vh - ${HEADING_HEIGHT}px - ${BOTTOM_PADDING}px)`,
			overflowX: 'auto',
			paddingBottom: BOTTOM_PADDING,
		}}>
			{children}
		</div>
	);
}
