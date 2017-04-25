import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import DailyActivity from '../components/daily-activity';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Transaction from '../stores/transaction';
import Page from './page';
import TransactionEditPage from './transaction-edit-page';

type Props = {
	disableAnimation: boolean;
	store?: AppStore;
};

@observer
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
