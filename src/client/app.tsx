import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {action, computed, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import PinPrompt from './components/pin-prompt';
import TransactionConfirmationPrompt from './components/transaction-confirmation-prompt';
import Layout from './layout';
import Storage from './shared/storage';
import theme from './shared/theme';
import AppStore from './stores/app';

const {Component} = React;
const TRANSITION_TIME = 500;

type Props = {
	children?: any;
};

class AppInitStore {
	@observable public pin = '';
	@observable public needUserPin = false;

	@computed get checkingPin() {
		return this.needUserPin && (this.pin.length === 4);
	}
}

const Layers = {
	BOTTOM: 0,
	MIDDLE: 1,
	TOP: 2,
};
const Styles = `
	body {
		overflow: hidden;
	}
	.page {
		z-index: ${Layers.MIDDLE};
		transform: translateZ(0);
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
		opacity: 0;
	}

	.page-enter-active.slide-vertical {
		opacity: 1;
		transform: translate(0, 0);
		transition: opacity ${TRANSITION_TIME / 2}ms;
	}

	.page-enter-active.slide-vertical.page-disable-in {
		transition: none;
	}

	.slide-vertical + .slide-vertical {
		z-index: ${Layers.BOTTOM};
	}

	/* Horizontal Slide */
	.slide-horizontal {
		z-index: ${Layers.TOP};
	}

	.page-enter.slide-horizontal {
		transform: translate(100vw, 0);
	}

	.page-enter-active.slide-horizontal {
		transform: translate(0, 0);
		transition: transform ${TRANSITION_TIME}ms;
	}

	.page-leave.slide-horizontal {
		transform: translate(0, 0);
	}
	.page-leave-active.slide-horizontal {
		transform: translate(100vw, 0);
		transition: transform ${TRANSITION_TIME}ms;
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

	.dialog-vert-resize-fix {
		padding-top: 0 !important;
	}
`;

@observer
export default
class App extends Component<Props, any> {
	public store: AppStore;
	public initStore: AppInitStore;

	constructor(props: Props) {
		super(props);
		this.initStore = new AppInitStore();
		this.store = new AppStore();
		(window as any).store = this.store;
	}
	public render() {
		const {
			checkingPin,
			needUserPin,
			pin,
		} = this.initStore;

		return (
			<MuiThemeProvider muiTheme={theme}>
					<Layout>
						<PinPrompt
							open={needUserPin}
							busy={checkingPin}
							pin={pin}
							onClearPin={() => this.handleClearPin()}
							onPinUpdate={(newPin: string) => this.handlePinUpdate(newPin)}
						/>

						{this.store.currentProfile && this.store.currentProfile.transactions && (
							<TransactionConfirmationPrompt
								store={this.store}
								open={!!this.store.showTransactionConfirmation}
								transactions={this.store.currentProfile.unconfirmedTransactions}
								onDone={() => this.store.dismissTransactionConfirmation()}
							/>
						)}
						<style>{Styles}</style>
						{this.store.currentProfile && (
							<Provider appStore={this.store}>
								<CSSTransitionGroup
									component="div"
									transitionName="page"
									transitionEnterTimeout={TRANSITION_TIME}
									transitionLeaveTimeout={TRANSITION_TIME}
								>
									{this.props.children}
								</CSSTransitionGroup>
							</Provider>
						)}
					</Layout>
			</MuiThemeProvider>
		);
	}

	@action private handleClearPin() {
		this.initStore.pin = '';
	}

	@action private handlePinUpdate(pin: string) {
		this.initStore.pin = pin;

		if(this.initStore.checkingPin) {
			if(Storage.init()) {
				this.initStore.needUserPin = false;
			} else {
				this.initStore.pin = '';
			}
		}
	}
}
