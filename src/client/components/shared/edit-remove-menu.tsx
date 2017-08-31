import * as MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import * as React from 'react';

import Account from '../../stores/account';

// https://github.com/Microsoft/TypeScript/issues/6395

const { Component } = React;

interface Props<T> {
	type: string;
	item: T;
	onRemove: (item: T) => void;
	onEdit?: (item: T) => void;
}

interface State {
	open: boolean;
}

class EditRemoveMenu<T> extends Component<Props<T>, State> {
	constructor(props: Props<T>) {
		super(props);
		this.state = {
			open: false,
		};
	}

	public render() {
		const {
			type,
			item,
			onRemove,
			onEdit,
		} = this.props;
		const editItemProps: any = {
			primaryText: 'Edit',
			rightIcon: <EditorModeEdit/>,
		};

		if(onEdit) {
			editItemProps.onClick = onEdit;
		} else {
			editItemProps.href = `#/${type}/edit/${item.id}`;
		}

		return ([
			<IconButton
				onClick={() => this.handleOpen()}
			>
				<MoreVertIcon/>
			</IconButton>,
			<Menu>
				<MenuItem {...editItemProps}/>
				<MenuItem
					onClick={() => onRemove(item)}
					primaryText="Remove"
					rightIcon={<ActionDelete/>}
				/>
			</Menu>,
		]);
	}

	private handleOpen() {
		this.setState({
			open: true,
		});
	}
}

export
class AccountEditRemoveMenu extends EditRemoveMenu<Account> {}
