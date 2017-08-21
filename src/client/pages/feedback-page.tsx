import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import * as React from 'react';

import Feedback from '../components/feedback-form';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import { pageStyle } from '../shared/styles';
import AppStore from '../stores/app';
import Page from './page';

const { Component } = React;

type Props = {
	appStore?: AppStore;
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
			<Page animationDirection="vertical">
				<Navigation title={FeedbackPage.title}/>
				<ContentArea style={pageStyle}>
					<Feedback />
				</ContentArea>
			</Page>
		);
	}
}
