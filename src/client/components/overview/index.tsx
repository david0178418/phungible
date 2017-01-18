
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ActionTrendingDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ActionTrendingUp from 'material-ui/svg-icons/navigation/arrow-upward';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {browserHistory, Link} from 'react-router';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import BudgetEntry, {BudgetType} from '../../shared/stores/budget-entry';

type BudgetHandler = (budgetEntry: BudgetEntry) => void;
type Props = {
	store: AppStore;
};
type ListProps = {
	budgetEntries: BudgetEntry[];
	onEdit: BudgetHandler;
	onRemove: BudgetHandler;
};

class OverviewStore {
	public appStore: AppStore;
	@observable private _openBudgetEntry: BudgetEntry | null;

	constructor(appStore: AppStore) {
		this.appStore = appStore;
		(window as any).overviewStore = this;
	}

	@action public closeBudgetOpenEntry() {
		this._openBudgetEntry = null;
	}
	@action public createBudgetEntry() {
		this._openBudgetEntry = new BudgetEntry();
	}
	@action public saveBudgetEntry() {
		this.appStore.saveBudgetEntry(this._openBudgetEntry);
		this.closeBudgetOpenEntry();
	}
	@action public editBudgetEntry(budgetEntry: BudgetEntry) {
		this._openBudgetEntry = BudgetEntry.clone(budgetEntry);
	}

	@computed get accounts() {
		return this.appStore.accounts;
	}
	@computed get budgetEntries() {
		return this.appStore.budgetEntries;
	}
	@computed get isOpen() {
		return !!this._openBudgetEntry;
	}
	get openBudgetEntry(): BudgetEntry {
		return this._openBudgetEntry;
	}
}

const BudgetEntryList = observer(function({budgetEntries, onEdit, onRemove}: ListProps) {
	return (
		<List>
			{budgetEntries.map((budgetEntry) => {
				const iconButton = (
					<IconButton
						onTouchTap={() => onRemove(budgetEntry)}
					><ContentRemove/></IconButton>
				);
				return (
					<ListItem
						key={budgetEntry.id}
						primaryText={`${budgetEntry.name}`}
						secondaryText={`Current Balance: $${budgetEntry.amount}`}
						leftIcon={budgetEntry.type === BudgetType.Income ? <ActionTrendingUp/> : <ActionTrendingDown/>}
						onTouchTap={() => onEdit(budgetEntry)}
						rightIconButton={iconButton}
					/>
				);
			})}
		</List>
	);
});

@observer
export default
class Overview extends Component<Props, any> {
	private store: OverviewStore;

	constructor(props: Props) {
		super(props);

		this.store = new OverviewStore(props.store);
	}

	public removeEntry(budgetEntry: BudgetEntry) {
		this.props.store.removeBudgetEntry(budgetEntry);
	}

	public render() {
		const store = this.store;

		return (
			<div>
				<Navigation />
				<BudgetEntryList
					budgetEntries={store.budgetEntries}
					onRemove={(budgetEntry: BudgetEntry) => this.props.store.removeBudgetEntry(budgetEntry)}
					onEdit={(budgetEntry: BudgetEntry) => this.handleEditBudgetEntry(budgetEntry.id)}
				/>
				<FloatingActionButton
					containerElement={<Link to="/create-budget-entry" />}
					zDepth={2}
				>
					<ContentAdd />
				</FloatingActionButton>
			</div>
		);
	}

	private handleEditBudgetEntry(budgetEntryId: number) {
		browserHistory.push(`/create-budget-entry/${budgetEntryId}`);
	}
}
