import * as React from 'react';

import Nav from './navigation';

export default
function MainLayout(props: any) {
	return (
		<div>
			<Nav />
			<div className="container">
				{props.children}
			</div>
		</div>
	);
}
