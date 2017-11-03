import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import DoneIcon from 'material-ui/svg-icons/action/done';
import AddCricleOutlineIcon from 'material-ui/svg-icons/content/add-circle-outline';
import MoneyIcon from 'material-ui/svg-icons/editor/attach-money';
import FolderOpenIcon from 'material-ui/svg-icons/file/folder-open';
import TrendingDownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import TrendingUpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import * as React from 'react';

import Colors from './colors';

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
	style?: any;
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
