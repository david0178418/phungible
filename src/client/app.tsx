import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import PinPrompt from './components/pin-prompt';
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
	@computed get checkingPin() {
		return this.needUserPin && (this.pin.length === 4);
	}
}

function ChildWithStore(child: any, store: AppStore) {
	return child ? React.cloneElement(child, {
		store,
	}) : child;
}

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
		Storage.initStorage((success: boolean) => {
			if(success) {
				this.handleStorageInit();
			} else {
				this.initStore.needUserPin = true;
			}
		});
	}

	public render() {
		return (
			<MuiThemeProvider muiTheme={theme}>
					<Layout>
						<PinPrompt
							open={this.initStore.needUserPin}
							busy={this.initStore.checkingPin}
							pin={this.initStore.pin}
							onClearPin={() => this.handleClearPin()}
							onPinUpdate={(pin: string) => this.handlePinUpdate(pin)}
						/>
						<style>{`
							body {
								overflow: hidden;
							}
							.page {
								z-index: 1;
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
						{!!this.store && (
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
