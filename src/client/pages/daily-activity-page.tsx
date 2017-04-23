import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import * as React from 'react';
import {Component} from 'react';

import DailyActivity from '../components/daily-activity';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import AppStore from '../shared/stores/app';
import Transaction from '../shared/stores/transaction';
import {floatingActionButtonStyle} from '../shared/styles';
import Page from './page';
import TransactionEditPage from './transaction-edit-page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

export default
class DailyActivityPage extends Component<Props, {}> {
	public static path = '/daily-activity/';

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
						onRemove={(transaction: Transaction) => this.props.store.removeTransaction(transaction)}
					/>
					<FloatingActionButton
						containerElement={<Link to={TransactionEditPage.path} />}
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}
}
