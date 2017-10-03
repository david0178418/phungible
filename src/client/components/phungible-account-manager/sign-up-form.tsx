import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { registerUser, signIn } from '../../shared/api';

const { Component } = React;

class Actions {
	@action public static setCreating(store: Store) {
		store.creatingAccount = true;
	}
	@action public static setEmail(store: Store, email: string) {
		store.email = email.trim();
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
			Selectors.isValidEmail(store) &&
			Selectors.isValidPassword(store)
		);
	}
	public static canSignIn(store: Store) {
		return !!(
			!store.creatingAccount &&
			store.email.trim() &&
			store.password.trim()
		);
	}
	public static isValidEmail(store: Store) {
		const email = store.email.trim();
		return (
			email.length >= 3 &&
			email.length <= 254 &&
			email.indexOf('@') !== -1 &&
			email.indexOf(' ') === -1
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

const style = {
	textAlign: 'center',
};

interface Props {
	email?: string;
}

class Store {
	@observable public creatingAccount = false;
	@observable public email = '';
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
	}

	public render() {
		const {
			creatingAccount,
			email,
			password,
			retypedPassword,
		} = this.store;

		return (
			<div style={style}>
				<TextField
					floatingLabelText="Email address"
					value={email}
					onChange={(e, val) => Actions.setEmail(this.store, val)}
				/>
				<TextField
					floatingLabelText="Password"
					hintText="Must be at least 6 characters"
					type="password"
					value={password}
					onChange={(e, val) => Actions.setPassword(this.store, val)}
				/>
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
							onClick={() => registerUser(email, password)}
						/>
						<p>
							<FlatButton
								label="I have an account"
								onClick={() => Actions.setNotCreating(this.store)}
							/>
						</p>
					</div>
				) : (
					<div>
						<RaisedButton
							primary
							label="Sign In"
							disabled={!Selectors.canSignIn(this.store)}
							onClick={() => signIn(email, password)}
						/>
						<p>
							<FlatButton
								label="I don\'t have an account"
								onClick={() => Actions.setCreating(this.store)}
							/>
						</p>
					</div>
				)}
			</div>
		);
	}
}
