import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import MoreHorizontal from 'material-ui/svg-icons/navigation/more-horiz';
import * as React from 'react';
import {Link} from 'react-router';

// Explicitly called as a function vs TSX due to rendering issue in the latter
export default
function EditRemoveMenu<T extends {id: number}>(
	type: string,
	item: T,
	onRemove: (item: T) => void,
) {
	return (
		<IconMenu
			anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			iconButtonElement={<IconButton><MoreHorizontal/></IconButton>}
			targetOrigin={{horizontal: 'right', vertical: 'top'}}
		>
			<MenuItem
				containerElement={<Link to={`/${type}/edit/${item.id}`}/>}
				primaryText="Edit"
				rightIcon={<EditorModeEdit/>}
			/>
			<MenuItem
				onTouchTap={() => onRemove(item)}
				primaryText="Remove"
				rightIcon={<ActionDelete/>}
			/>
		</IconMenu>
	);
}
