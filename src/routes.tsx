import React, { lazy, Suspense } from 'react';
import { IonRouterOutlet, IonLoading } from '@ionic/react';
import { Route } from 'react-router-dom';

interface ComponentImport {
    default: () => JSX.Element;
}
type ComponentFactory = () => Promise<ComponentImport>;
type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;

function prefetchFn(timing: number) {
	const prefetchList: ComponentFactory[] = [];

	setTimeout(async () => {
		for(let component of prefetchList) {
			await component();
		}
	}, timing);

	return (componentImport: ComponentFactory): LazyComponent => {
		prefetchList.push(componentImport);
		return lazy(componentImport);
	};
}

const prefetch = prefetchFn(5000);

const AccountsPage = prefetch(() => import('./pages/accounts.page'));
const AccountEditPage = prefetch(() => import('./pages/account-edit.page'));
const BudgetsPage = prefetch(() => import('./pages/budgets.page'));
const BudgetEditPage = prefetch(() => import('./pages/budget-edit.page'));
const DailyActivityPage = prefetch(() => import('./pages/daily-activity.page'));
const RecurringTransactions = prefetch(() => import('./pages/recurring-transactions.page'));
const RecurringTransactionEdit = prefetch(() => import('./pages/recurring-transaction-edit.page'));
const SettingsPage = prefetch(() => import('./pages/settings.page'));
const ProfilesPage = prefetch(() => import('./pages/profiles.page'));
const ProfileEditPage = prefetch(() => import('./pages/profile-edit.page'));
const TransactionsPage = prefetch(() => import('./pages/transactions.page'));
const TransactionEditPage = prefetch(() => import('./pages/transaction-edit.page'));
const TrendsPage = prefetch(() => import('./pages/trends.page'));
const WelcomePage = prefetch(() => import('./pages/welcome.page'));
const HelpPage = prefetch(() => import('./pages/help.page'));
const LoginPage = prefetch(() => import('./pages/login.page'));


export
function Routes() {
	return (
		<Suspense fallback={<IonLoading isOpen />}>
			<IonRouterOutlet id="main">
				<Route
					path="/accounts"
					component={AccountsPage}
				/>
				<Route
					path="/account/:id?"
					component={AccountEditPage}
				/>
				<Route
					path="/budgets"
					component={BudgetsPage}
				/>
				<Route
					path="/budget/:id?"
					component={BudgetEditPage}
				/>
				<Route
					path="/help"
					component={HelpPage}
				/>
				<Route
					path="/login"
					component={LoginPage}
				/>
				<Route
					path="/recurring-transactions"
					component={RecurringTransactions}
				/>
				<Route
					path="/recurring-transaction/:id?"
					component={RecurringTransactionEdit}
				/>
				<Route
					path="/settings"
					component={SettingsPage}
				/>
				<Route
					path="/profiles"
					component={ProfilesPage}
				/>
				<Route
					path="/profile/:id?"
					component={ProfileEditPage}
				/>
				<Route
					path="/transactions"
					component={TransactionsPage}
				/>
				<Route
					path="/transaction/:id?"
					component={TransactionEditPage}
				/>
				<Route
					path="/trends"
					component={TrendsPage}
				/>
				<Route
					path="/welcome"
					component={WelcomePage}
				/>
				<Route
					exact
					path="/"
					component={DailyActivityPage}
				/>
			</IonRouterOutlet>
		</Suspense>
	);
}
