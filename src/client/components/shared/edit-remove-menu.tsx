import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';
import * as React from 'react';

// Explicitly called as a function vs TSX due to rendering issue in the latter
export default
function EditRemoveMenu<T extends {id: string}>(
	type: string,
	item: T,
	onRemove: (item: T) => void,
	onEdit?: (item: T) => void,
) {
	const editItemProps: any = {
		primaryText: 'Edit',
		rightIcon: <EditorModeEdit/>,
	};

	if(onEdit) {
		editItemProps.onClick = onEdit;
	} else {
		editItemProps.href = `#/${type}/edit/${item.id}`;
	}

	return (
		<IconMenu
			anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
			iconButtonElement={<IconButton><MoreVertical/></IconButton>}
			targetOrigin={{horizontal: 'right', vertical: 'top'}}
		>
			<MenuItem {...editItemProps}/>
			<MenuItem
				onClick={() => onRemove(item)}
				primaryText="Remove"
				rightIcon={<ActionDelete/>}
			/>
		</IconMenu>
	);
}
