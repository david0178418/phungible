import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import {Icon} from '../../global/shared-components';
import {AppStore, BudgetEntry, BudgetType, RepeatUnits} from '../../global/types';
import BudgetEntryEdit from '../budget-entry-edit';

type removeHandler = (budgetEntry: BudgetEntry) => void;
type Props = {
	store: AppStore;
};
type TableProps = {
	budgetEntries: BudgetEntry[];
	onRemove: removeHandler;
};
type EditModalProps = {
	budgetEntry: BudgetEntry;
	isOpen: boolean;
	save(): void;
	cancel(): void
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
		this.appStore.addBudgetEntry(this._openBudgetEntry);
		this.closeBudgetOpenEntry();
	}
	public editBudgetEntry(budgetEntry: BudgetEntry) {
		this._openBudgetEntry
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

function Row(onRemove: removeHandler, budgetEntry: BudgetEntry) {
	return (
		<tr key={`${budgetEntry.name}+${budgetEntry.type}+${budgetEntry.amount}`}>
			<td>{budgetEntry.name}</td>
			<td>{BudgetType[budgetEntry.type]}</td>
			<td>${budgetEntry.prettyAmount}</td>
			<td>{budgetEntry.startDate.toLocaleDateString()}</td>
			<td>
				{budgetEntry.repeats ?
					`Every ${budgetEntry.repeatValue} ${RepeatUnits[budgetEntry.repeatUnit]}s` :
					'Never'
				}
			</td>
			<td>
				<Button color="link">
					<Icon type="pencil"/>
				</Button>
				<Button color="link" onClick={() => onRemove(budgetEntry)}>
					<Icon type="close"/>
				</Button>
			</td>
		</tr>
	);
}

const Table = observer(function({budgetEntries, onRemove}: TableProps) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Amount</th>
					<th>Start Date</th>
					<th>Repeats</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{budgetEntries.map(Row.bind(null, onRemove))}
			</tbody>
		</table>
	);
});

const EditModal = observer(function({budgetEntry, cancel, isOpen, save}: EditModalProps) {
	return (
		<Modal isOpen={isOpen} toggle={cancel}>
			<ModalHeader toggle={cancel}>Modal title</ModalHeader>
			<ModalBody>
				<BudgetEntryEdit
					budgetEntry={budgetEntry}
					onSubmit={cancel}
					
				/>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={save} disabled={!budgetEntry.isValid}>Save</Button>{' '}
				<Button color="secondary" onClick={cancel}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
});

@observer
export default
class Overview extends Component<Props, any> {
	store: OverviewStore

	constructor(props: Props) {
		super(props);

		this.store = new OverviewStore(props.store);
	}

	public removeEntry(budgetEntry: BudgetEntry) {
		this.props.store.removeBudgetEntry(budgetEntry)
	}

	public render() {
		const store = this.store;

		return (
			<div>
				<Button color="primary" onClick={() => this.handleCreateEntry()}>
					<Icon type="plus" />
					{' Create an Entry'}
				</Button>
				<Table
					budgetEntries={store.budgetEntries}
					onRemove={(budgetEntry: BudgetEntry) => this.props.store.removeBudgetEntry(budgetEntry)}
				/>
				{store.isOpen &&
					<EditModal
						budgetEntry={store.openBudgetEntry}
						cancel={() => store.closeBudgetOpenEntry()}
						isOpen={store.isOpen}
						save={() => store.saveBudgetEntry()}
					/>
				}
			</div>
		);
	}

	public handleCreateEntry() {
		this.store.createBudgetEntry();
	}
}
