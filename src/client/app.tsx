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
						.page-appear {
							margin-top: 100vh;
						}

						.page-appear-active {
							margin-top: 0;
							transition: margin-top 300ms;
						}

						.page-leave {
							position: absolute;
							top: 0;
						}
						.page-leave-active {
							top: -100wh;
							transition: margin-top 300ms;
						}
					`}</style>
					<CSSTransitionGroup
						component="div"
						transitionName="page"
						transitionEnterTimeout={300}
						transitionAppearTimeout={300}
						transitionLeaveTimeout={300}
						transitionLeave={true}
						transitionAppear={true}
					>
						{this.props.children}
					</CSSTransitionGroup>
				</Layout>
			</MuiThemeProvider>
		);
	}
}
