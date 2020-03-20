import React, {
} from 'react';
import {
	Collection,
	Account,
} from '../interfaces';
import { CollectionPage } from '../components/collection-page';
import { AccountItem } from '../components/account-item';

export
function AccountsPage() {
	return (
		<CollectionPage
			collectionType={Collection.Accounts}
			label="Accounts"
			editPath="/account"
			itemRenderFn={(account: Account) => (
				<AccountItem account={account} />
			)}
		/>
	);
}

export default AccountsPage;
