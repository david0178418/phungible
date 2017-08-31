import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { registerUser } from '../../shared/api';

const {Component} = React;

const style = {
	textAlign: 'center',
};

interface Props {
	onSubmit(): void;
}

class Store {
	@observable public email = '';
	@observable public password = '';
}

const setEmail = action(function(store: Store, email: string) {
	store.email = email;
});

const setPassword = action(function(store: Store, password: string) {
	store.password = password;
});

function isValidEmail(email: string) {
	email = email.trim();
	return (
		email.length >= 3 &&
		email.length <= 254 &&
		email.indexOf('@') !== -1 &&
		email.indexOf(' ') === -1
	);
}

function isValidPassword(password: string) {
	return (
		password.length >= 6 &&
		password.length <= 1000 &&
		password.indexOf(' ') === -1
	);
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
		let {
			email,
			password,
		} = this.store;
		email = email.trim();
		password = password.trim();
		const emailIsValid = isValidEmail(email);
		const passwordIsValid = isValidPassword(password);
		return (
			<div style={style}>
				<TextField
					floatingLabelText="Email address"
					onChange={(e, val) => setEmail(this.store, val)}
				/>
				<TextField
					floatingLabelText="Password"
					hintText="Must be at least 6 characters"
					onChange={(e, val) => setPassword(this.store, val)}
					type="password"
				/>
				<br/>
				<FlatButton
					primary
					disabled={!(emailIsValid && passwordIsValid)}
					label="Create Account"
					onClick={() => registerUser(email, password)}
				/>
			</div>
		);
	}
}
