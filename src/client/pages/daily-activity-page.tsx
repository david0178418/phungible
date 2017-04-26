import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import DailyActivity from '../components/daily-activity';
import ContentArea from '../components/shared/content-area';
import Navigation from '../layout/navigation';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

@observer
export default
class DailyActivityPage extends Component<Props, {}> {
	public static path = '/';

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {store} = this.props;
		return (
			<Page className={this.props.disableAnimation ? '' : 'slide-vertical'}>
				<Navigation title="Daily Activity" store={store} />
				<ContentArea>
					<DailyActivity
						store={store}
						onAdd={(transaction: Transaction) => this.props.store.saveTransaction(transaction)}
						onRemove={(transaction: Transaction) => this.props.store.removeTransaction(transaction)}
					/>
				</ContentArea>
			</Page>
		);
	}
}
