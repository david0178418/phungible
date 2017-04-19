import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Component} from 'react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';
import {getItem} from '../client/shared/storage';

import Layout from './layout';
import AppStore from './shared/stores/app';

type Props = {
	children?: any;
};

export default
class App extends Component<Props, any> {
	public static childContextTypes = {
		store: AppStore,
	};

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

	public getChildContext() {
		return {
			store: this.store,
		};
	}

	public render() {
		return (
			<MuiThemeProvider>
				<Layout>
					<style>{`
						.page {
							z-index: 1;
						}
						.page-enter,
						.page-leave {
							border-left: 1px solid black;
							border-right: 1px solid black;
							box-sizing: border-box;
						}

						/* Vertical slide */
						.page-enter.slide-vertical {
							top: 100vh;
						}

						.page-enter-active.slide-vertical {
							top: 0;
							transition: top 300ms;
						}

						.page-leave.slide-vertical {
							top: 0;
						}
						.page-leave-active.slide-vertical {
							top: -100vh;
							transition: top 300ms;
						}

						/* Horizontal Slide */
						.slide-horizontal {
							z-index: 3;
						}
						.page-enter.slide-horizontal {
							left: 100vw;
						}

						.page-enter-active.slide-horizontal {
							left: 0;
							transition: left 300ms;
						}

						.page-leave.slide-horizontal {
							left: 0;
							top: 0;
						}
						.page-leave-active.slide-horizontal {
							left: 100vw;
							transition: left 300ms;
						}
					`}</style>
					<CSSTransitionGroup
						component="div"
						transitionName="page"
						transitionEnterTimeout={300}
						transitionLeaveTimeout={300}
					>
						{this.props.children}
					</CSSTransitionGroup>
				</Layout>
			</MuiThemeProvider>
		);
	}
}
