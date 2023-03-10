import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {inject} from 'mobx-react';
import * as React from 'react';

import BudgetsList from '../components/budgets-list';
import ContentArea from '../components/shared/content-area';
import Link from '../components/shared/link';
import Navigation from '../layout/navigation';
import {floatingActionButtonStyle} from '../shared/styles';
import AppStore from '../stores/app';
import Budget from '../stores/budget';
import Page from './page';

const {Component} = React;

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class Budgets extends Component<Props> {
	public static path = '/budgets';
	public static title = 'Budgets';

	public render() {
		const store = this.props.appStore;
		return (
			<Page animationDirection="vertical">
				<Navigation
					title="Budgets"
					appStore={store}
				/>
				<ContentArea>
					<BudgetsList
						items={store.currentProfile.budgets}
						store={store}
						onRemove={
							(budget: Budget) =>
								this.props.appStore.currentProfile.removeBudget(budget)
						}
					/>
					<FloatingActionButton
						secondary
						containerElement={<Link to="/budget/edit" />}
						style={floatingActionButtonStyle}
					>
						<ContentAdd />
					</FloatingActionButton>
				</ContentArea>
			</Page>
		);
	}
}
