import * as React from 'react';
import {Component} from 'react';

import {pageStyling} from '../../shared/styles';
import Money from '../../shared/utils/money';
import {AccountType} from '../../stores/account';
import AppStore from '../../stores/app';

type Props = {
	store?: AppStore;
};

export default
class Index extends Component<Props, any> {
	public render() {
		const {
			accounts,
		} = this.props.store;
		return (
			<div style={pageStyling}>
				<p>
					Today's Balance is {Money.formatMoney(accounts.reduce((total, account) => {
						return total += account.latestBalanceUpdate.balance.val * (account.type === AccountType.Savings ? 1 : -1);
					}, 0))}
				</p>
			</div>
		);
	}
}
