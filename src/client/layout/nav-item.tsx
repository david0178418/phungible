import MenuItem from 'material-ui/MenuItem';
import * as React from 'react';

const iconProps = {
	style: {
		margin: '12px 5px',
	},
};

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
			leftIcon={React.cloneElement(leftIcon, iconProps)}
			onTouchTap={onTouchTap}
			innerDivStyle={{
				padding: '0 42px',
			}}
			rightIcon={rightIcon && React.cloneElement(rightIcon, iconProps)}
		>
			{children}
		</MenuItem>
	);
}
