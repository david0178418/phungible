import {FloatingActionButton} from 'material-ui';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentCreate from 'material-ui/svg-icons/content/create';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {browserHistory, Link} from 'react-router';

import Navigation from '../../layout/navigation';
import AppStore from '../../shared/stores/app';
import BudgetEntry, {BudgetType, RepeatUnits} from '../../shared/stores/budget-entry';

type BudgetHandler = (budgetEntry: BudgetEntry) => void;
type Props = {
	store: AppStore;
};
type TableProps = {
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

function Row(onRemove: BudgetHandler, onEdit: BudgetHandler, budgetEntry: BudgetEntry) {
	return (
		<TableRow
			key={`${budgetEntry.name}+${budgetEntry.type}+${budgetEntry.amount}`}
			selectable={false}
		>
			<TableRowColumn>{budgetEntry.name}</TableRowColumn>
			<TableRowColumn>{BudgetType[budgetEntry.type]}</TableRowColumn>
			<TableRowColumn>${budgetEntry.prettyAmount}</TableRowColumn>
			<TableRowColumn>{budgetEntry.startDate.toLocaleDateString()}</TableRowColumn>
			<TableRowColumn>
				{budgetEntry.repeats ?
					`Every ${budgetEntry.repeatValue} ${RepeatUnits[budgetEntry.repeatUnit]}s` :
					'Never'
				}
			</TableRowColumn>
			<TableRowColumn>
				<FlatButton
					icon={<ContentCreate />}
					onClick={() => onEdit(budgetEntry)}
				/>
				<FlatButton
					icon={<ContentClear />}
					onClick={() => onRemove(budgetEntry)}
				/>
			</TableRowColumn>
		</TableRow>
	);
}

const TransationTable = observer(function({budgetEntries, onEdit, onRemove}: TableProps) {
	return (
		<Table
		>
			<TableHeader
				displaySelectAll={false}
				adjustForCheckbox={false}
			>
				<TableRow>
					<TableHeaderColumn>Name</TableHeaderColumn>
					<TableHeaderColumn>Type</TableHeaderColumn>
					<TableHeaderColumn>Amount</TableHeaderColumn>
					<TableHeaderColumn>Start Date</TableHeaderColumn>
					<TableHeaderColumn>Repeats</TableHeaderColumn>
					<TableHeaderColumn></TableHeaderColumn>
				</TableRow>
			</TableHeader>
			<TableBody
				displayRowCheckbox={false}
			>
				{budgetEntries.map(Row.bind(null, onRemove, onEdit))}
			</TableBody>
		</Table>
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
				<TransationTable
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
