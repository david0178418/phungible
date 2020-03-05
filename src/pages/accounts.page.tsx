import React, {
} from 'react';
import {
	IonNote,
	IonText,
	IonIcon,
	IonLabel,
} from '@ionic/react';
import {
	cashOutline,
	card,
} from 'ionicons/icons';
import {
	Collection,
	Account,
	AccountType,
} from '../interfaces';
import { CollectionPage } from '../components/collection-page';

export
function AccountsPage() {
	return (
		<CollectionPage<Account>
			collectionType={Collection.Accounts}
			label="Accounts"
			editHref="/account/"
			itemRenderFn={(doc) => (
				<>
					{doc.type === AccountType.Savings ? (
						<IonIcon
							slot="start"
							color="money"
							icon={cashOutline}
						/>
					) : (
						<IonIcon
							slot="start"
							color="debt"
							icon={card}
						/>
					)}
					<div>
						<IonLabel>
							{doc.name}
						</IonLabel>
						<IonNote>
							<em>
								$X.XX pending
							</em>
						</IonNote>
					</div>
					<IonText
						slot="end"
						color={doc.type === AccountType.Savings ? 'money' : 'debt'}
					>
						${doc.balanceUpdateHistory[0].balance}
					</IonText>
				</>
			)}
		/>
	);
}

export default AccountsPage;
