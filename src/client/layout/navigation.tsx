import * as React from 'react';
import {Link} from 'react-router';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';

export default
function Navigation() {
	return (
		<div>
			<Navbar color="faded">
				<NavbarBrand href="/">Budget Tool</NavbarBrand>
				<Nav className="float-right" navbar>
					<NavItem>
						<Link className="nav-link" to="/overview">Overview</Link>
					</NavItem>
					<NavItem>
						<Link className="nav-link" to="/create-budget-entry">Create</Link>
					</NavItem>
				</Nav>
			</Navbar>
		</div>
	);
}
