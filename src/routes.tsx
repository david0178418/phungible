import React, { lazy, useEffect, Suspense } from 'react';
import { IonRouterOutlet, IonLoading } from '@ionic/react';
import { Route, useLocation } from 'react-router-dom';
import { ActiveProfileGuard } from '@components/route-guards';

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

const AccountsPage = prefetch(() => import('@pages/accounts.page'));
const AccountEditPage = prefetch(() => import('@pages/account-edit.page'));
const BudgetsPage = prefetch(() => import('@pages/budgets.page'));
const BudgetEditPage = prefetch(() => import('@pages/budget-edit.page'));
const DailyActivityPage = prefetch(() => import('@pages/daily-activity.page'));
const RecurringTransactions = prefetch(() => import('@pages/recurring-transactions.page'));
const RecurringTransactionEdit = prefetch(() => import('@pages/recurring-transaction-edit.page'));
const SettingsPage = prefetch(() => import('@pages/settings.page'));
const ProfilesPage = prefetch(() => import('@pages/profiles.page'));
const ProfileEditPage = prefetch(() => import('@pages/profile-edit.page'));
const TransactionsPage = prefetch(() => import('@pages/transactions.page'));
const TransactionEditPage = prefetch(() => import('@pages/transaction-edit.page'));
const TrendsPage = prefetch(() => import('@pages/trends.page'));
const WelcomePage = prefetch(() => import('@pages/welcome.page'));
const HelpPage = prefetch(() => import('@pages/help.page'));
const LoginPage = prefetch(() => import('@pages/login.page'));
const GettingStartedPage = lazy(() => import('@pages/getting-started.page'));

const fullScreenRoutes = [
	'/getting-started',
];

interface Props {
	onPathChange?: (paneDisabled: boolean) => void;
}

export
function Routes(props: Props) {
	const {pathname} = useLocation();
	const {
		onPathChange = () => null,
	} = props;

	useEffect(() => {
		onPathChange(fullScreenRoutes.includes(pathname));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);
	return (
		<Suspense fallback={<IonLoading isOpen />}>
			<IonRouterOutlet id="main">
				<Route
					path="/help"
					component={HelpPage}
				/>
				<Route
					path="/getting-started"
					component={GettingStartedPage}
				/>
				<Route
					path="/welcome"
					component={WelcomePage}
				/>
				<ActiveProfileGuard negate>
					<Route
						path="/login"
						component={LoginPage}
					/>
				</ActiveProfileGuard>
				<ActiveProfileGuard>
					<>
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
							exact
							path="/"
							component={DailyActivityPage}
						/>
					</>
				</ActiveProfileGuard>
			</IonRouterOutlet>
		</Suspense>
	);
}
