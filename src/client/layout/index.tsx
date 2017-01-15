import * as React from 'react';

export default
function MainLayout(props: any) {
	return (
		<div>
			<div>
				{props.children}
			</div>
		</div>
	);
}
