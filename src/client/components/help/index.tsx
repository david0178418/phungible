import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {inject} from 'mobx-react';
import * as React from 'react';
import {Component} from 'react';

import GettingStartedPage from '../../pages/getting-started-page';
import {dialogStyles} from '../../shared/styles';

interface State {
	openContent: string;
}

interface Props {
	router?: Navigo;
}

@inject('router')
export default
class Help extends Component<Props, State> {
	constructor(props: Props) {
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
						primaryText="Getting Started"
						onTouchTap={() => this.handleOpenGettingStarted()}
					/>
					<ListItem
						primaryText="About Accounts"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
					<ListItem
						primaryText="About Transactions"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
					<ListItem
						primaryText="About Recurring Transactions"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
					<ListItem
						primaryText="About Budgets"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
					<ListItem
						primaryText="How are trends calculated?"
						onTouchTap={() => this.handleOpen(
							`Coming soon...`,
						)}
					/>
				</List>
				<Dialog
					autoScrollBodyContent
					{...dialogStyles}
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

	private handleOpenGettingStarted() {
		this.props.router.navigate(GettingStartedPage.path);
	}
}
