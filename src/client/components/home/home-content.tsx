import * as React from 'react';
import {Component} from 'react';

import {AccountType} from '../../shared/stores/account';
import AppStore from '../../shared/stores/app';
import Money from '../../shared/utils/money';

type Props = {
	store: AppStore;
};

export default
class Index extends Component<Props, any> {
	public render() {
		const {
			accounts,
		} = this.props.store;
		return (
			<div>
				<h1>Welcome back</h1>
				<p>
					Today's Balance is {Money.formatMoney(accounts.reduce((total, account) => {
						return total += account.latestBalanceUpdate.balance.val * (account.type === AccountType.Savings ? 1 : -1);
					}, 0))}
				</p>
			</div>
		);
	}
}
