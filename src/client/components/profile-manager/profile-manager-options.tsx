import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';

import * as React from 'react';

interface Props {
	onEdit(): void;
	onRemove(): void;
	onSelect?(): void;
	onSync?(): void;
}

export default
function ProfileManagerOptions({
	onEdit,
	onRemove,
	onSelect,
	onSync,
}: Props) {
	return (
		<IconMenu
			iconButtonElement={<IconButton><MoreVertical/></IconButton>}
		>
			<MenuItem
				onClick={onEdit}
				primaryText="Edit"
			/>
			{onSelect && (
				<MenuItem
					onClick={onSelect}
					primaryText="Select"
				/>
			)}
			{onSync && (
				<MenuItem
					onClick={onSync}
					primaryText="Sync"
				/>
			)}
			<MenuItem
				onClick={onRemove}
				primaryText="Remove"
				rightIcon={<ActionDelete/>}
			/>
		</IconMenu>
	);
}
