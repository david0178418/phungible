import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {action, computed, observable} from 'mobx';
import {observer, Provider} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import ActivationPrompt from './components/activation-prompt';
import PinPrompt from './components/pin-prompt';
import TransactionConfirmationPrompt from './components/transaction-confirmation-prompt';
import Layout from './layout';
import Storage from './shared/storage';
import theme from './shared/theme';
import AppStore from './stores/app';
import ProfilesStore, {Profile} from './stores/profiles';

type Props = {
	children?: any;
};

class AppInitStore {
	@observable public pin = '';
	@observable public needUserPin = false;
	@observable public isActivated = true;

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
		transform: translate(0, 100vh);
	}

	.page-enter-active.slide-vertical {
		transform: translate(0, 0);
		transition: transform 350ms;
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

	.dialog-vert-resize-fix {
		padding-top: 0 !important;
	}
`;

@observer
export default
class App extends Component<Props, any> {
	@observable public store: AppStore;
	public initStore: AppInitStore;
	public currentProfile: Profile;

	constructor(props: Props) {
		super(props);
		this.initStore = new AppInitStore();
	}

	// TODO Cleanup quick/hack encryption code
	@action public componentDidMount() {
		if(Storage.isActivated()) {
			Storage.initStorage((success: boolean) => {
				if(success) {
					this.handleStorageInit();
				} else {
					this.initStore.needUserPin = true;
				}
			});
		} else {
			this.initStore.isActivated = false;
		}
	}

	public render() {
		const {
			checkingPin,
			isActivated,
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
						<ActivationPrompt
							open={!isActivated}
							onActivation={() => this.handleActivation()}
						/>
						{!!this.store && (
							<TransactionConfirmationPrompt
								open={this.store.showTransactionConfirmation}
								transactions={this.store.unconfirmedTransactions}
								onDone={() => this.store.dismissTransactionConfirmation()}
							/>
						)}
						<style>{Styles}</style>
						{!!this.store && (
							<Provider appStore={this.store}>
								<CSSTransitionGroup
									component="div"
									transitionName="page"
									transitionEnterTimeout={350}
									transitionLeaveTimeout={350}
								>
									{this.props.children}
								</CSSTransitionGroup>
							</Provider>
						)}
					</Layout>
			</MuiThemeProvider>
		);
	}

	@action private handleActivation() {
		this.initStore.isActivated = true;
		Storage.actvate();
		Storage.initStorage(() => this.handleStorageInit());
	}

	@action private handleClearPin() {
		this.initStore.pin = '';
	}

	@action private handlePinUpdate(pin: string) {
		this.initStore.pin = pin;

		if(this.initStore.checkingPin) {
			Storage.initStorage((success: boolean) => {
				if(success) {
					this.handleStorageInit();
					this.initStore.needUserPin = false;
				} else {
					this.initStore.pin = '';
				}
			}, this.initStore.pin);
		}
	}

	@action private handleStorageInit() {
		this.currentProfile = ProfilesStore.getCurrentProfile();
		const data = ProfilesStore.getProfileData(this.currentProfile.id);

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
}
