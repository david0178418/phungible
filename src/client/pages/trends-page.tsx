import RefreshIndicator from 'material-ui/RefreshIndicator';
import * as React from 'react';
import {Component} from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import ContentArea from '../components/shared/content-area';
import Trends from '../components/trends';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

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
		}, 150);
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
							<RefreshIndicator
								left={-35}
								top={150}
								size={70}
								status="loading"
								style={{
									marginLeft: '50%',
								}}
							/>
						)}
					</CSSTransitionGroup>
				</ContentArea>
			</Page>
		);
	}
}
