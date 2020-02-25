import * as classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

const { Component } = React;

type PageAnimationDirection = 'vertical' | 'horizontal' | '';

class PageCoordinator {
	@observable public currentDirection: PageAnimationDirection = '';
	@observable public prevDirection: PageAnimationDirection = '';
	@observable public nextDirection: PageAnimationDirection = '';
}

const pc = new PageCoordinator();

const transitionPage =
	action(function(nextPage: PageAnimationDirection) {
		pc.prevDirection = pc.currentDirection;
		pc.currentDirection = nextPage;
	});

class Store {
	@computed get disableAnimateIn() {
		return pc.prevDirection === 'horizontal';
	}
}

type Props = {
	animationDirection?: PageAnimationDirection;
	children?: any;
	className?: string;
	style?: any;
};

const defaultStyle: any = {
	backgroundColor: 'white',
	height: '100vh',
	position: 'absolute',
	width: '100vw',
};

@observer
export default
class Page extends Component<Props> {
	private store: Store;

	constructor(props: Props) {
		super(props);

		transitionPage(props.animationDirection);
		this.store = new Store();
	}

	public render() {
		const {
			animationDirection,
			children,
			className = '',
			style,
		} = this.props;
		const {
			disableAnimateIn,
		} = this.store;

		const computedStyle = {
			...defaultStyle,
			...style,
		};

		const classes = classNames('page', `slide-${animationDirection}`, className, {
			'page-disable-in': disableAnimateIn,

		});

		return (
			<div style={computedStyle} className={classes}>
				{children}
			</div>
		);
	}
}
