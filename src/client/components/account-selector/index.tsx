import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import * as React from 'react';

import Account from '../../stores/account';

type AccountSelectorProps = {
	accounts: Account[];
	errorText?: string;
	label: string;
	selectedAccountId: string | null;
	style?: {}
	onChange(value: string, index?: number): void;
};

export default
function AccountsSelector({
	accounts,
	errorText = '',
	label,
	onChange,
	selectedAccountId,
}: AccountSelectorProps) {
	return (
		<SelectField
			fullWidth
			errorText={errorText}
			floatingLabelText={label}
			value={selectedAccountId || null}
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
}
