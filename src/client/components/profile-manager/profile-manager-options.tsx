import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';

import * as React from 'react';

export default
function ProfileManagerOptions({
	onEdit,
	onRemove,
	onOpenProfile,
	onSync,
}: ProfileManagerOptionsProps) {
	return (
		<IconMenu
			iconButtonElement={<IconButton><MoreVertical/></IconButton>}
		>
			<MenuItem
				onClick={onEdit}
				primaryText="Rename"
			/>
			{onOpenProfile && (
				<MenuItem
					onClick={onOpenProfile}
					primaryText="Open"
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
