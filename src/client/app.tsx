import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Component} from 'react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {getItem} from '../client/shared/storage';

import Layout from './layout';
import AppStore from './shared/stores/app';

type Props = {
	children?: any;
};

function ChildWithStore(child: any, store: AppStore) {
	return child ? React.cloneElement(child, {
		store,
	}) : child;
}

export default
class App extends Component<Props, any> {
	public store: AppStore;

	constructor(props: Props) {
		super(props);
		const data = getItem('store');

		if(data) {
			this.store = AppStore.deserialize(data);
		} else {
			this.store = new AppStore();
		}

		this.store.runTransactionSinceLastUpdate();

		// Check every 5 minutes.  Runs transactions when day rolls over
		setTimeout(() => {
			this.store.runTransactionSinceLastUpdate();
		}, 1000 * 60 * 5);
	}

	public render() {
		return (
			<MuiThemeProvider>
				<Layout>
					<style>{`
						body {
							overflow: hidden;
						}
						.page {
							z-index: 1;
						}
						.page-enter,
						.page-leave {
							box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
							box-sizing: border-box;
						}

						.page-leave {
							top: 0;
						}

						/* Vertical slide */
						.page-enter.slide-vertical {
							transform: translate(0, 100vh);
						}

						.page-enter-active.slide-vertical {
							transform: translate(0, 0);
							transition: transform 350ms;
							z-index: 2;
						}

						/* Horizontal Slide */
						.slide-horizontal {
							z-index: 3;
						}
						.page-enter.slide-horizontal {
							transform: translate(100vw, 0);
						}

						.page-enter-active.slide-horizontal {
							transform: translate(0, 0);
							transition: transform 350ms;
						}

						.page-leave.slide-horizontal {
							transform: translate(0, 0);
						}
						.page-leave-active.slide-horizontal {
							transform: translate(100vw, 0);
							transition: transform 350ms;
						}

						/* CONTENT */
						.page-content-enter {
							opacity: 0;
						}

						.page-content-enter-active {
							opacity: 1;
							transition: opacity 400ms;
						}

						.page-content-leave {
							opacity: 1;
							transition: opacity 400ms;
						}

						.page-content-leave-active {
							opacity: 0;
						}
					`}</style>
					<CSSTransitionGroup
						component="div"
						transitionName="page"
						transitionEnterTimeout={350}
						transitionLeaveTimeout={350}
					>
						{React.Children.map(
							this.props.children,
							(child) => ChildWithStore(child, this.store),
						)}
					</CSSTransitionGroup>
				</Layout>
			</MuiThemeProvider>
		);
	}
}
