import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';

import Account from '../../shared/stores/account';

type AccountSelectorProps = {
	accounts: Account[];
	label: string;
	selectedAccount: Account | null;
	style?: {}
	onChange(value: Account, index?: number): void;
};

export default
function AccountsSelector({accounts, label, onChange, selectedAccount}: AccountSelectorProps) {
	return (
		<SelectField
			fullWidth
			floatingLabelText={label}
			value={selectedAccount && selectedAccount.id}
			onChange={(ev, index, value) => onChange(value, index)}
		>
			<MenuItem value={false} primaryText="None" />
			{accounts.map((account) => {
				return (
					<MenuItem
						key={account.id}
						value={account.id}
						primaryText={account.name}
					/>
				);
			})}
		</SelectField>
	);
};
