import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import DailyActivity from '../components/daily-activity';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

type Props = {
	appStore?: AppStore;
	disableAnimation: boolean;
};

@inject('appStore') @observer
export default
class DailyActivityPage extends Component<Props, {}> {
	public static path = '/';
	public static title = 'Daily Activity';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {appStore} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title="Daily Activity" appStore={appStore} />
				<ContentArea>
					<DailyActivity
						appStore={appStore}
						onAdd={(transaction: Transaction) => this.props.appStore.saveTransaction(transaction)}
						onRemove={(transaction: Transaction) => this.props.appStore.removeTransaction(transaction)}
					/>
				</ContentArea>
			</Page>
		);
	}
}
