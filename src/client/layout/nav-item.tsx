import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';

type Props = {
	children?: any;
	disabled?: boolean;
	href?: string;
	leftIcon: React.ReactElement<any>;
	rightIcon?: React.ReactElement<any>;
	onTouchTap: () => any;
};

export default
function NavItem({
	children,
	disabled = false,
	href,
	leftIcon,
	onTouchTap,
	rightIcon,
}: Props) {
	return (
		<MenuItem
			disabled={disabled}
			href={`#${href}`}
			leftIcon={leftIcon}
			onTouchTap={onTouchTap}
			rightIcon={rightIcon}
		>
			{children}
		</MenuItem>
	);
}
