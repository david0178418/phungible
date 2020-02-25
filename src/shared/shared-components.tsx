import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ActionCompareArrows from 'material-ui/svg-icons/action/compare-arrows';
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import DoneIcon from 'material-ui/svg-icons/action/done';
import AddCricleOutlineIcon from 'material-ui/svg-icons/content/add-circle-outline';
import MoneyIcon from 'material-ui/svg-icons/editor/attach-money';
import FolderOpenIcon from 'material-ui/svg-icons/file/folder-open';
import TrendingDownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import TrendingUpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import { observer } from 'mobx-react';
import * as React from 'react';

import AccountSelector from '../components/account-selector';
import {TransactionType} from '../constants';
import Account from '../stores/account';
import { AccountActionModel } from '../types';
import Colors from './colors';
import { fromAccountErrText, towardAccountErrText } from './utils/error-messages';

type CSSProperties = React.CSSProperties;

interface IconProps {
	type: string;
}

export
function Icon({type}: IconProps) {
	return (
		<span className={`fa fa-${type}`}></span>
	);
}

interface SvgIconProps {
	style?: CSSProperties;
}

export
function AddIcon({style}: SvgIconProps) {
	return (
		<AddCricleOutlineIcon style={style} />
	);
}

export
function DebtIcon({style}: SvgIconProps) {
	return (
		<CreditCardIcon color={Colors.Debt} style={style} />
	);
}

export
function SavingsIcon({style}: SvgIconProps) {
	return (
		<MoneyIcon color={Colors.Money} style={style} />
	);
}

export
function ExpenseIcon({style}: SvgIconProps) {
	return (
		<TrendingDownIcon color={Colors.Debt} style={style} />
	);
}

export
function IncomeIcon({style}: SvgIconProps) {
	return (
		<TrendingUpIcon color={Colors.Money} style={style} />
	);
}

export
function TransferIcon({style}: SvgIconProps) {
	return (
		<ActionCompareArrows style={style} />
	);
}

export
function ConfirmIcon({style}: SvgIconProps) {
	return (
		<DoneIcon style={style} />
	);
}

export
function ProfileIcon({style}: SvgIconProps) {
	return (
		<FolderOpenIcon style={style} />
	);
}

interface TypeIconProps {
	type: TransactionType;
	style?: CSSProperties;
}
export
function TypeIcon({type, style}: TypeIconProps) {
	if(type === TransactionType.Income) {
		return <IncomeIcon style={style} />;
	}

	if(type === TransactionType.TransferPayment) {
		return <TransferIcon style={style} />;
	}

	return <ExpenseIcon  style={style} />;
}

interface TypeSelectProps {
	value: any;
	onChange(e: React.SyntheticEvent<{}>, index: number, menuItemValue: any): void;
}

export
const TypeSelect = observer(function(props: TypeSelectProps) {
	return (
		<SelectField
			{...props}
			fullWidth
			floatingLabelText="Type"
		>
			<MenuItem
				leftIcon={<IncomeIcon/>}
				primaryText="Income"
				value={TransactionType.Income}
			/>
			<MenuItem
				leftIcon={<TransferIcon/>}
				primaryText="Account Transfer/Payment"
				value={TransactionType.TransferPayment}
			/>
			<MenuItem
				leftIcon={<ExpenseIcon/>}
				primaryText="Expense"
				value={TransactionType.Expense}
			/>
		</SelectField>
	);
});

interface AccountSelectorProps {
	accounts: Account[];
	hideTowardsAccount?: boolean;
	model: AccountActionModel;
	onFromChange(value: string): void;
	onTowardChange(value: string): void;
}

export
const FromTowardAccountSelector = observer(function(props: AccountSelectorProps) {
	const {
		accounts,
		hideTowardsAccount,
		model,
		onFromChange,
		onTowardChange,
	} = props;
	const selectedTowardAccountId = model.towardAccount && model.towardAccount.id || null;
	const selectedFromAccountId = model.fromAccount && model.fromAccount.id || null;
	const showFrom = model.transactionType !== TransactionType.Income;
	const showToward = (
		!hideTowardsAccount &&
		model.transactionType !== TransactionType.BudgetedExpense &&
		model.transactionType !== TransactionType.Expense
	);

	return (
		<>
			{!!accounts.length && (
				<div>
					{showFrom && (
						<AccountSelector
							errorText={fromAccountErrText(model)}
							accounts={accounts}
							label="From Account"
							onChange={onFromChange}
							selectedAccountId={selectedFromAccountId}
						/>
					)}
					{showToward && (
						<AccountSelector
							errorText={towardAccountErrText(model)}
							accounts={accounts}
							label="Towards Account"
							onChange={onTowardChange}
							selectedAccountId={selectedTowardAccountId}
						/>
					)}
				</div>
			)}
		</>
	);
});
