import * as React from 'react';

import {BudgetEntry} from '../../global/types';
import BudgetEntryEdit from '../budget-entry-edit';

export default
function CreateBudgetEntry(props: BudgetEntry) {
	return (
		<div>
			<h2>Create Budget Entry</h2>
			<BudgetEntryEdit budgetEntry={new BudgetEntry()} />
		</div>
	);
}
