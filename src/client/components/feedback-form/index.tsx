import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Component } from 'react';

import Storage from '../../shared/storage';
import AppStore from '../../stores/app';

const USER_EMAIL_KEY = 'userEmail';

interface Props {
	appStore?: AppStore;
}

class FeedbackStore {
	@observable public isBug = false;
	@observable public userFeedback = '';
	@observable public userEmail = '';

	constructor() {
		this.userEmail = Storage.getItem(USER_EMAIL_KEY) || '';
	}

	public setIsBug(bugVal: boolean) {
		this.setVal('isBug', bugVal);

	}

	public setEmail(newEmail: string) {
		if(this.setVal('userEmail', newEmail)) {
			Storage.setItem(USER_EMAIL_KEY, newEmail);
		}
	}

	public setUserFeedback(newEmail: string) {
		this.setVal('userFeedback', newEmail);
	}

	@action private setVal<Field extends keyof FeedbackStore>(field: Field, val: FeedbackStore[Field]) {
		if(this[field] !== val) {
			this[field] = val;
			return true;
		}
		return false;
	}
}

@inject('appStore') @observer
export default
class FeedbackForm extends Component<Props, {}> {
	private store: FeedbackStore;

	constructor(props: Props) {
		super(props);

		this.store = new FeedbackStore();
	}

	public render() {
		const {
			store,
		} = this;
		return (
			<div>
				<p>
					Do you have some feedback?  Did you find a bug? Want to
					share say something nice (or mean!) with us?
				</p>
				<p>
					<TextField
						floatingLabelText="Email address"
						value={store.userEmail}
						onChange={(ev, val) => store.setEmail(val)}
						fullWidth
					/>
					<TextField
						fullWidth
						multiLine
						floatingLabelText="Feedback"
						errorText="Must be at least 100 character"
						value={store.userFeedback}
						onChange={(ev, val) => store.setUserFeedback(val)}
					/>
					<Checkbox
						checked={store.isBug}
						onCheck={(ev, val) => store.setIsBug(val)}
						label="I'm reporting a bug"
					/>
				</p>
				<p>
					<RaisedButton
						primary
						fullWidth
						label="Submit"
					/>
				</p>
			</div>
		);
	}
}
