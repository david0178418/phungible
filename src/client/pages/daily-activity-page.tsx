import {inject, observer} from 'mobx-react';
import * as React from 'react';

import DailyActivity from '../components/daily-activity';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore') @observer
export default
class DailyActivityPage extends Component<Props> {
	public static path = '/';
	public static title = 'Daily Activity';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page animationDirection="vertical">
				<Navigation title="Daily Activity" appStore={appStore} />
				<ContentArea>
					<DailyActivity
						appStore={appStore}
						onAdd={(transaction: Transaction) => this.props.appStore.currentProfile.saveTransaction(transaction)}
						onRemove={(transaction: Transaction) => this.props.appStore.currentProfile.removeTransaction(transaction)}
					/>
				</ContentArea>
			</Page>
		);
	}
}
