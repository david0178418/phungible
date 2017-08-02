import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import MoneyEdit from '../shared/money-edit';

import {BudgetPartial} from '../../stores/budget';

type Props = {
	transactionPartials: BudgetPartial[];
	onAddEntry(): void;
	onRemoveEntry(id: string): void;
	onUpdateName(val: string, Budget: {name: string}): void;
};

@observer
export default
class BudgetEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div>
				{(this.props.transactionPartials.map((schedTranspartial) => (
					<div
						key={schedTranspartial.id}
						style={{
							display: 'flex',
						}}
					>
						<TextField
							errorText={schedTranspartial.name ? '' : 'Name is required'}
							floatingLabelText="Name"
							value={schedTranspartial.name}
							onChange={((ev: any, value: any) => this.props.onUpdateName(value, schedTranspartial)) as any}
						/>
						{' '}
						<MoneyEdit
							style={{
								marginLeft: 10,
							}}
							money={schedTranspartial.amount}
						/>
						{this.props.transactionPartials.length > 1 && (
							<IconButton
								style={{
									alignSelf: 'flex-end',
								}}
								onTouchTap={() => this.handleRemoveEntry(schedTranspartial.id)}
							>
								<ActionDelete/>
							</IconButton>
						)}
					</div>
				)))}
				<RaisedButton
					fullWidth
					style={{
						marginTop: 15,
					}}
					label="Add another"
					onTouchTap={() => this.props.onAddEntry()}
					primary
				/>
			</div>
		);
	}

	private handleRemoveEntry(id: string) {
		setTimeout(() => {
			this.props.onRemoveEntry(id);
		}, 200);
	}
}
