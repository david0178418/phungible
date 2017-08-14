import MenuItem from 'material-ui/MenuItem';
import {inject} from 'mobx-react';
import * as React from 'react';

const {Component} = React;

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
	router?: Navigo;
};

@inject('router')
export default
class NavItem extends Component<Props, {}> {
	public render() {
		const {
			children,
			disabled = false,
			href,
			leftIcon,
			rightIcon,
		} = this.props;
		return (
			<MenuItem
				disabled={disabled}
				leftIcon={React.cloneElement(leftIcon, iconProps)}
				onTouchTap={() => this.handleRoute(href)}
				innerDivStyle={{
					padding: '0 42px',
				}}
				rightIcon={rightIcon && React.cloneElement(rightIcon, iconProps)}
			>
				{children}
			</MenuItem>
		);
	}

	private handleRoute(route: string) {
		this.props.onTouchTap();
		this.props.router.navigate(route);
	}
}
