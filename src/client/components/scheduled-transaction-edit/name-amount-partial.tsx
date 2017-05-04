import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';
import MoneyEdit from '../shared/money-edit';

import {ScheduledTransactionPartial} from '../../stores/scheduled-transaction';

type Props = {
	transactionPartials: ScheduledTransactionPartial[];
	onAddEntry(): void;
	onRemoveEntry(id: string): void;
	onUpdateName(val: string, schScheduledTransaction: {name: string}): void;
};

@observer
export default
class ScheduledTransactionEdit extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		return (
			<div>
				{(this.props.transactionPartials.map((schedTranspartial) => (
					<div key={schedTranspartial.id}>
						<TextField
							floatingLabelText="Name"
							style={{width: 150}}
							value={schedTranspartial.name}
							onChange={((ev: any, value: any) => this.props.onUpdateName(value, schedTranspartial)) as any}
						/>
						{' '}
						<MoneyEdit
							style={{
								display: 'inline-block',
							}}
							money={schedTranspartial.amount}
						/>
						{this.props.transactionPartials.length > 1 && <IconButton
							onTouchTap={() => this.handleRemoveEntry(schedTranspartial.id)}
						>
							<ActionDelete/>
						</IconButton>}
					</div>
				)))}
				<RaisedButton
					fullWidth
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
