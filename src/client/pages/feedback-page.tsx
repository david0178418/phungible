import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import * as React from 'react';
import {Component} from 'react';

import Feedback from '../components/feedback-form';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Page from './page';

type Props = {
	appStore?: AppStore;
	disableAnimation: boolean;
};

export default
class FeedbackPage extends Component<Props, {}> {
	public static path = '/feedback';
	public static title = 'Feedback';
	public static icon = FeedbackIcon;

	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title={FeedbackPage.title}/>
				<ContentArea>
					<Feedback />
				</ContentArea>
			</Page>
		);
	}
}
