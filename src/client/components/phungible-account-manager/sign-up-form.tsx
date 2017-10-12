import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { login, register } from '../../shared/api';

const { Component } = React;

class Actions {
	@action public static setCreating(store: Store) {
		store.creatingAccount = true;
	}
	@action public static setUsername(store: Store, username: string) {
		store.username = username.trim();
	}
	@action public static setNotCreating(store: Store) {
		store.creatingAccount = false;
	}
	@action public static setPassword(store: Store, password: string) {
		store.password = password.trim();
	}
	@action public static setRetypedPassword(store: Store, password: string) {
		store.retypedPassword = password.trim();
	}
}

class Selectors {
	public static canCreateAccount(store: Store) {
		return (
			store.creatingAccount &&
			Selectors.isValidUsername(store) &&
			Selectors.isValidPassword(store) &&
			Selectors.passwordsMatch(store)
		);
	}
	public static canSignIn(store: Store) {
		return !!(
			!store.creatingAccount &&
			store.username.trim() &&
			store.password.trim()
		);
	}
	public static isValidUsername(store: Store) {
		const username = store.username.trim();
		return (
			username.length >= 4 &&
			username.length <= 25 &&
			username.indexOf(' ') === -1
		);
	}
	public static isValidPassword(store: Store) {
		const password = store.password;

		return (
			password.length >= 6 &&
			password.length <= 1000 &&
			password.indexOf(' ') === -1
		);
	}
	public static passwordsMatch(store: Store) {
		return store.password === store.retypedPassword;
	}
}

interface Props {
	username?: string;
	onCreation(username: string): void;
	onLogin(username: string): void;
}

class Store {
	@observable public creatingAccount = false;
	@observable public username = '';
	@observable public errorMessage = '';
	@observable public password = '';
	@observable public retypedPassword = '';
}

@observer
export default
class Settings extends Component<Props, {}> {
	private store: Store;

	constructor(props: Props) {
		super(props);
		this.store = new Store();

		if(props.username) {
			this.store.username = props.username;
		}
	}

	public render() {
		const {
			creatingAccount,
			username,
			errorMessage,
			password,
			retypedPassword,
		} = this.store;

		return (
			<div>
				<TextField
					floatingLabelText="Username"
					value={username}
					onChange={(e, val) => Actions.setUsername(this.store, val)}
				/>
				<div>
					<TextField
						floatingLabelText="Password"
						hintText={creatingAccount ? 'Minimum 6 characters' : ''}
						type="password"
						value={password}
						onChange={(e, val) => Actions.setPassword(this.store, val)}
					/>
				</div>
				{creatingAccount ? (
					<div>
						<TextField
							autoComplete="off"
							floatingLabelText="Confirm Password"
							type="password"
							value={retypedPassword}
							errorText={
								!Selectors.passwordsMatch(this.store) &&
								'Passwords do not match'
							}
							onChange={(e, val) => Actions.setRetypedPassword(this.store, val)}
						/>
						<br/>
						<RaisedButton
							primary
							disabled={!Selectors.canCreateAccount(this.store)}
							label="Create Account"
							onClick={() => this.handleCreate(username, password)}
						/>
						<div>
							<FlatButton
								label="I have an account"
								onClick={() => Actions.setNotCreating(this.store)}
							/>
						</div>
					</div>
				) : (
					<div>
						<RaisedButton
							primary
							label="Sign In"
							disabled={!Selectors.canSignIn(this.store)}
							onClick={() => this.handleLogin(username, password)}
						/>
						<div>
							<FlatButton
								label="I don\'t have an account"
								onClick={() => Actions.setCreating(this.store)}
							/>
						</div>
					</div>
				)}
				<div>
					{errorMessage}
				</div>
			</div>
		);
	}

	private async handleCreate(username: string, password: string) {
			const regResp = await register(username, password);
			if(!regResp.error) {
				this.handleLogin(username, password);
			} else {
				this.store.errorMessage = 'User exists';
			}
	}

	private async handleLogin(username: string, password: string) {
		const loginResp = await login(username, password);

		if(!loginResp.error) {
			this.props.onLogin(username);
		} else {
			this.store.errorMessage = loginResp.reason;
		}
	}
}
