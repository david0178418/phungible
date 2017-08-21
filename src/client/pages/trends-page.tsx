import RefreshIndicator from 'material-ui/RefreshIndicator';
import {inject} from 'mobx-react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import ContentArea from '../components/shared/content-area';
import Trends from '../components/trends';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

type State = {
	renderBody: boolean;
};

@inject('appStore')
export default
class TrendsPage extends Component<Props, State> {
	public static path = '/trends/';
	public static title = 'Trends';

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
		const {appStore} = this.props;
		const {renderBody} = this.state;
		return (
			<Page animationDirection="vertical">
				<Navigation
					title="Trends"
					appStore={appStore}
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
								accounts={appStore.accounts}
								budgets={appStore.budgets}
								transactions={appStore.transactions}
								scheduledTransactions={appStore.scheduledTransactions}
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
