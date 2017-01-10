import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import {Icon} from '../../global/shared-components';
import {AppStore, BudgetEntry, BudgetType, RepeatUnits} from '../../global/types';

type removeHandler = (budgetEntry: BudgetEntry) => void;

type Props = {
	store: AppStore;
};
type TableProps = {
	budgetEntries: BudgetEntry[];
	onRemove: removeHandler;
};

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

function CreateModal({isOpen, toggle}: {isOpen: boolean, toggle: () => void}) {
	return (
		<Modal isOpen={isOpen} toggle={toggle}>
			<ModalHeader toggle={toggle}>Modal title</ModalHeader>
			<ModalBody>
				Modal Content
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={toggle}>Do Something</Button>{' '}
				<Button color="secondary" onClick={toggle}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
}

@observer
export default
class Overview extends Component<Props, any> {
	@observable isOpen: boolean = false;

	constructor(props: Props) {
		super(props);
	}

	public render() {
		const {
			budgetEntries,
		} = this.props.store;

		return (
			<div>
				<Button color="primary" onClick={() => this.isOpen = true}>
					<Icon type="plus" />
					{' Create an Entry'}
				</Button>
				<Table budgetEntries={budgetEntries} onRemove={(budgetEntry: BudgetEntry) => this.props.store.removeBudgetEntry(budgetEntry)}/>
				<CreateModal isOpen={this.isOpen} toggle={() => this.isOpen = false}/>
			</div>
		);
	}
}
