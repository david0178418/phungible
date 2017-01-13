import * as React from 'react';
import {Link} from 'react-router';
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';

export default
function Navigation() {
	return (
		<div>
			<Navbar color="faded">
				<NavbarBrand href="/">Budget Tool</NavbarBrand>
				<Nav className="ml-auto" navbar>
					<NavItem>
						<Link className="nav-link" to="/overview">Budget Entries</Link>
					</NavItem>
					<NavItem>
						<Link className="nav-link" to="/accounts">Accounts</Link>
					</NavItem>
				</Nav>
			</Navbar>
		</div>
	);
}
