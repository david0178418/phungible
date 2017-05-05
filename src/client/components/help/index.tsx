import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import * as React from 'react';
import {Component} from 'react';

interface State {
	openContent: string;
}

const customContentStyle = {
	maxWidth: 'none',
	width: '100%',
};

export default
class Help extends Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = {
			openContent: '',
		};
	}

	public render() {
		return (
			<div>
				<List>
					<ListItem
						primaryText="About Accounts"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<List>
					<ListItem
						primaryText="About Transactions"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<List>
					<ListItem
						primaryText="About Recurring Transactions"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<List>
					<ListItem
						primaryText="About Budgets"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<List>
					<ListItem
						primaryText="How are trends calculated?"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<Dialog
					autoScrollBodyContent
					contentStyle={customContentStyle}
					open={!!this.state.openContent}
					onRequestClose={() => this.handleClose()}
					actions={[
						<FlatButton
							label="Done"
							primary
							onTouchTap={() => this.handleClose()}
						/>,
					]}
				>
					{this.state.openContent}
				</Dialog>
			</div>
		);
	}

	private handleClose() {
		this.setState({
			openContent: '',
		});
	}

	private handleOpen(content: string) {
		this.setState({
			openContent: content,
		});
	}
}
