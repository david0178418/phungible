import * as React from 'react';

import Navigation from './navigation';

export default
function MainLayout(props: any) {
	return (
		<div>
			<Navigation />
			<div className="container">
				{props.children}
			</div>
		</div>
	);
}
