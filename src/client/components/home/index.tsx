import {inject} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import {pageStyle} from '../../shared/styles';
import Money from '../../shared/utils/money';
import {AccountType} from '../../stores/account';
import AppStore from '../../stores/app';

type Props = {
	appStore?: AppStore;
};

@inject('appStore')
export default
class Summary extends Component<Props, any> {
	public render() {
		const {
			accounts,
		} = this.props.appStore;
		return (
			<div style={pageStyle}>
				<p>
					Today's Balance is {Money.formatMoney(accounts.reduce((total, account) => {
						return total += account.latestBalanceUpdate.balance.val * (account.type === AccountType.Savings ? 1 : -1);
					}, 0))}
				</p>
			</div>
		);
	}
}
