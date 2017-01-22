import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';

import Account from '../../shared/stores/account';

type AccountSelectorProps = {
	accounts: Account[];
	label: string;
	selectedAccount: Account | false;
	style?: {}
	onChange(value: Account, index?: number): void;
};

export default
function AccountsSelector({accounts, label, onChange, selectedAccount}: AccountSelectorProps) {
	return (
		<SelectField
			fullWidth
			floatingLabelText={label}
			value={selectedAccount}
			onChange={(ev, index, value) => onChange(value, index)}
		>
			<MenuItem value={false} primaryText="None" />
			{accounts.map((account) => {
				return (
					<MenuItem
						key={account.id}
						value={account}
						primaryText={account.name}
					/>
				);
			})}
		</SelectField>
	);
};
