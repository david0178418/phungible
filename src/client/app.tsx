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

						/* Vertical slide */
						.page-enter.slide-vertical {
							top: 100vh;
						}

						.page-enter-active.slide-vertical {
							top: 0;
							transition: top 350ms;
							z-index: 2;
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
							transition: left 350ms;
						}

						.page-leave.slide-horizontal {
							left: 0;
							top: 0;
						}
						.page-leave-active.slide-horizontal {
							left: 100vw;
							transition: left 350ms;
						}
					`}</style>
					<CSSTransitionGroup
						component="div"
						transitionName="page"
						transitionEnterTimeout={350}
						transitionLeaveTimeout={350}
					>
						{this.props.children}
					</CSSTransitionGroup>
				</Layout>
			</MuiThemeProvider>
		);
	}
}
