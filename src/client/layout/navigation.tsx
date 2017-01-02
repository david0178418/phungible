import * as React from 'react';
import {Link} from 'react-router';

export default
function Nav() {
	return (
		<nav className="navbar nav-inline">
			<Link className="nav-link" to="/">Home</Link>
			<Link className="nav-link" to="/create-budget-entry">Create</Link>
		</nav>
	);
}
