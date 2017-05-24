import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import MoneyIcon from 'material-ui/svg-icons/editor/attach-money';
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
