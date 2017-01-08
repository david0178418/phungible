import {observer} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import {Icon} from '../../global/shared-components';
import {AppStore, BudgetEntry, BudgetType, RepeatUnits} from '../../global/types';

type Props = {
	store: AppStore;
};
type TableProps = {
	budgetEntries: BudgetEntry[];
};

function Row(budgetEntry: BudgetEntry) {
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
		</tr>
	);
}

function Table({budgetEntries}: TableProps) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Amount</th>
					<th>Start Date</th>
					<th>Repeats</th>
				</tr>
			</thead>
			<tbody>
				{budgetEntries.map(Row)}
			</tbody>
		</table>
	);
}

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
	constructor(props: Props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	public render() {
		const {
			budgetEntries,
		} = this.props.store;

		return (
			<div>
				<Button color="primary" onClick={() => this.setState({isOpen: true})}>
					<Icon type="plus" />
					{' Create an Entry'}
				</Button>
				<Table budgetEntries={budgetEntries}/>
				<CreateModal isOpen={this.state.isOpen} toggle={() => this.setState({isOpen: false})}/>
			</div>
		);
	}
}
