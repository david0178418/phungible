import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';

import * as React from 'react';

export
interface ProfileManagerOptionsProps {
	onEdit(): void;
	onRemove?(): void;
	onOpenProfile?(): void;
}

export default
function ProfileManagerOptions({
	onEdit,
	onRemove,
	onOpenProfile,
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
			{onRemove && (
				<MenuItem
					onClick={onRemove}
					primaryText="Remove"
					rightIcon={<ActionDelete/>}
				/>
			)}
		</IconMenu>
	);
}
