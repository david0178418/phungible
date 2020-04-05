import React, {
} from 'react';
import { Budget, Collection } from '@shared/interfaces';
import { CollectionPage } from '@components/collection-page';
import { BudgetItem } from '@components/budget-item';

export
function BudgetsPage() {
	return (
		<CollectionPage
			collectionType={Collection.Budgets}
			label="Budget"
			editPath="/budget"
			itemRenderFn={(budget: Budget) => (
				<BudgetItem budget={budget} />
			)}
		/>
	);
}

export default BudgetsPage;
