import * as React from 'react';

const BOTTOM_PADDING = 80;
const HEADING_HEIGHT = 64;

type Props = {
	children?: any;
	style?: any;
};

export default
function ContentArea({children, style}: Props) {
	return (
		<div style={Object.assign({
			maxHeight: `calc(100vh - ${HEADING_HEIGHT}px - ${BOTTOM_PADDING}px)`,
			overflowX: 'auto',
			paddingBottom: BOTTOM_PADDING,
		}, style)}>
			{children}
		</div>
	);
}
