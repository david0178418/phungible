declare module "reactstrap" {
	import {Component} from 'react';

	type ModalProps = {
		className?: string;
		isOpen: boolean;
		// boolean to control the state of the popover
		toggle: (props: any) => any;
		// callback for toggling isOpen in the controlling component
		size?: string;
		// control backdrop, see http://v4-alpha.getbootstrap.com/components/modal/#options
		backdrop?: boolean | 'static';
		keyboard?: boolean;
		// zIndex defaults to 1000.
		zIndex?: number | string;
	}

	class Modal extends Component<ModalProps, any> {
		props: ModalProps;
	}
	

	class Button extends Component<any, any> {}
	class ModalFooter extends Component<any, any> {}
	class ModalHeader extends Component<any, any> {}
	class ModalBody extends Component<any, any> {}

	class Navbar extends Component<any, any> {}
	class NavbarBrand extends Component<any, any> {}
	class Nav extends Component<any, any> {}
	class NavItem extends Component<any, any> {}
	class NavLink extends Component<any, any> {}
}
