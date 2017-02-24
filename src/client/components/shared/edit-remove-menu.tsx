import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MoreHorizontal from 'material-ui/svg-icons/navigation/more-horiz';
import * as React from 'react';

// Explicitly called as a function vs TSX due to rendering issue in the latter
export default
function EditRemoveMenu<T>(
	item: T,
	onEdit: (itemId: T) => void,
	onRemove: (item: T) => void,
) {
	return (
		<IconMenu
			anchorOrigin={{horizontal: 'right', vertical: 'center'}}
			iconButtonElement={<IconButton><MoreHorizontal/></IconButton>}
			targetOrigin={{horizontal: 'right', vertical: 'top'}}
		>
			<MenuItem
				onTouchTap={() => onEdit(item)}
				primaryText="Edit"
				rightIconButton={<IconButton><EditorModeEdit/></IconButton>}
			/>
			<MenuItem
				onTouchTap={() => onRemove(item)}
				primaryText="Remove"
				rightIconButton={<IconButton><ActionDelete/></IconButton>}
			/>
		</IconMenu>
	);
}
