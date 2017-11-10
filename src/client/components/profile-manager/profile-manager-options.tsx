import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import MoreVertical from 'material-ui/svg-icons/navigation/more-vert';

import * as React from 'react';

interface Props {
	onRemove(): void;
	onSelect?(): void;
	onSync?(): void;
}

export default
function ProfileManagerOptions({
	onRemove,
	onSelect,
	onSync,
}: Props) {
	return (
		<IconMenu
			iconButtonElement={<IconButton><MoreVertical/></IconButton>}
		>
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
