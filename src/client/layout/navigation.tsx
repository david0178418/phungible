import * as React from 'react';
import {Link} from 'react-router';

export default
function Nav() {
	return (
		<nav className="navbar navbar-default navbar-static-top" role="navigation">
			<div className="navbar-header">
				<Link to="/">Budget Tool</Link>
			</div>
			<ul className="nav navbar-top-links navbar-right">
				<li>
					<Link to="/create-budget-entry">Create</Link>
				</li>
			</ul>
		</nav>
	);
}
