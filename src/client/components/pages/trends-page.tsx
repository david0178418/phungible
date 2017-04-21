import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';
import {Component} from 'react';
import * as CSSTransitionGroup from 'react-addons-css-transition-group';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import Page from '../pages/page';
import ContentArea from '../shared/content-area';
import Trends from '../trends';

const loaderStyle = {
	left: 'calc(50% - 75px)',
	marginLeft: 'auto',
	marginRight: 'auto',
	position: 'absolute',
	top: 'calc(50% - 75px)',
} as any;

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

type State = {
	renderBody: boolean;
};

export default
class TrendsPage extends Component<Props, State> {
	public static path = '/trends/';

	constructor(props: Props) {
		super(props);
		this.state = {
			renderBody: false,
		};
	}

	public componentDidMount() {
		setTimeout(() => {
			this.setState({
				renderBody: true,
			});
		}, 400);
	}

	public render() {
		const {store} = this.props;
		const {renderBody} = this.state;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation
					title="Trends"
					store={store}
				/>
				<ContentArea>
					<CSSTransitionGroup
						component="div"
						transitionName="page-content"
						transitionEnterTimeout={400}
						transitionLeaveTimeout={400}
					>
						{renderBody && (
							<Trends
								accounts={store.accounts}
								transactions={store.transactions}
								scheduledTransactions={store.scheduledTransactions}
							/>
						)}
						{!renderBody && (
							<CircularProgress
								style={loaderStyle}
								size={150}
								thickness={10}
							/>
						)}
					</CSSTransitionGroup>
				</ContentArea>
			</Page>
		);
	}
}
