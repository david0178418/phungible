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
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
	trendingUp,
	albumsOutline,
	swapHorizontal,
	walletOutline,
	calendarOutline,
	settingsOutline,
	repeat,
} from 'ionicons/icons';

interface AppPage {
	url: string;
	icon: string;
	title: string;
}

const appPages: AppPage[] = [
	{
		title: 'Daily Activity',
		url: '/',
		icon: calendarOutline,
	},
	{
		title: 'Trends',
		url: '/trends',
		icon: trendingUp,
	},
	{
		title: 'Accounts',
		url: '/accounts',
		icon: albumsOutline,
	},
	{
		title: 'Budgets',
		url: '/budgets',
		icon: walletOutline,
	},
	{
		title: 'Recurring Transactions',
		url: '/recurring-transactions',
		icon: repeat,
	},
	{
		title: 'Transactions',
		url: '/transactions',
		icon: swapHorizontal,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: settingsOutline,
	},
];

export
function Menu() {
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
					{appPages.map((appPage, index) => {
						const routerProps: any = pathname === appPage.url ? {
								detail: true,
							} : {
								className: 'selected',
								routerLink: appPage.url,
								detail: false,
							};
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									{...routerProps}
									routerDirection="none"
									lines="none"
								>
									<IonIcon slot="start" icon={appPage.icon} />
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						);
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
}