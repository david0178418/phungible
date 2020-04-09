import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonMenu,
	IonMenuToggle,
	IonHeader,
	IonToolbar,
	IonTitle,
} from '@ionic/react';
import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
	trendingUp,
	albumsOutline,
	swapHorizontal,
	walletOutline,
	calendarOutline,
	settingsOutline,
	repeat,
	peopleOutline,
	timeOutline,
} from 'ionicons/icons';
import { AccountsContext } from '@common/contexts';
import { usePendingTransactionsCollection } from '@common/hooks';
import { PendingTransactionsModal } from './pending-transactions-modal';

function pathProps(currentPath: string, targetUrl: string): any {
	const common = {
		routerDirection: 'root',
		lines: 'none',
	};
	return (currentPath === targetUrl) ? {
		...common,
		detail: true,
	} : {
		...common,
		className: 'selected',
		routerLink: targetUrl,
		detail: false,
	};
}

export
function Menu() {
	const accounts = useContext(AccountsContext);
	const { pathname } = useLocation();
	const pendingTransactions = usePendingTransactionsCollection();
	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setModalIsOpen(!!pendingTransactions.length);
		}, 1500);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<IonMenu contentId="main" type="overlay">
				<IonHeader>
					<IonToolbar color="primary">
						<IonTitle>Phungible</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						{!!pendingTransactions.length && (
							<IonMenuToggle autoHide={false}>
								<IonItem button onClick={() => setModalIsOpen(true)}>
									<IonIcon slot="start" icon={timeOutline} />
									<IonLabel>
										Pending ({pendingTransactions.length})
									</IonLabel>
								</IonItem>
							</IonMenuToggle>
						)}
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/')}
							>
								<IonIcon slot="start" icon={calendarOutline} />
								<IonLabel>
									Daily Activity
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/trends')}
							>
								<IonIcon slot="start" icon={trendingUp} />
								<IonLabel>
									Trends
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/accounts')}
							>
								<IonIcon slot="start" icon={albumsOutline} />
								<IonLabel>
									Accounts
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/budgets')}
								disabled={!accounts.length}
							>
								<IonIcon slot="start" icon={walletOutline} />
								<IonLabel>
									Budgets
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/recurring-transactions')}
								disabled={!accounts.length}
							>
								<IonIcon slot="start" icon={repeat} />
								<IonLabel>
									Recurring Transactions
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/transactions')}
								disabled={!accounts.length}
							>
								<IonIcon slot="start" icon={swapHorizontal} />
								<IonLabel>
									Transactions
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/profiles')}
							>
								<IonIcon slot="start" icon={peopleOutline} />
								<IonLabel>
									Profiles
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
						<IonMenuToggle autoHide={false}>
							<IonItem
								{...pathProps(pathname, '/settings')}
							>
								<IonIcon slot="start" icon={settingsOutline} />
								<IonLabel>
									Settings
								</IonLabel>
							</IonItem>
						</IonMenuToggle>
					</IonList>
				</IonContent>
			</IonMenu>
			<PendingTransactionsModal
				isOpen={modalIsOpen}
				onClose={() => setModalIsOpen(false)}
				transactions={pendingTransactions}
			/>
		</>
	);
}
