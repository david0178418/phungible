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
	IonListHeader,
} from '@ionic/react';
import React, { useContext } from 'react';
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
} from 'ionicons/icons';
import { ProfileContext, AccountsContext } from '@common/contexts';

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
	const profile = useContext(ProfileContext);
	const {pathname} = useLocation();

	return (
		<IonMenu contentId="main" type="overlay">
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>Phungible</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					{profile && (
						<IonListHeader lines="inset">
							Profile: {profile?.name}
						</IonListHeader>
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
							disabled={!accounts.length}
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
	);
}
