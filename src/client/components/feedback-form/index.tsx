import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import { Component } from 'react';

import {submitFeedback} from '../../shared/api';
import Storage from '../../shared/storage';
import AppStore from '../../stores/app';
const USER_EMAIL_KEY = 'userEmail';
const MIN_FEEDBACK = 75;

interface Props {
	appStore?: AppStore;
}

class FeedbackStore {
	@observable public isBug = false;
	@observable public feedback = '';
	@observable public email = '';
	@observable public open = true;

	@computed get emailIsValid() {
		return !this.email || this.email.indexOf('@') && this.email.trim().length > 3;
	}

	@computed get feedbackIsValid() {
		return this.feedback.length >= MIN_FEEDBACK;
	}

	@computed get isValid() {
		return this.feedbackIsValid && this.emailIsValid;
	}

	constructor() {
		this.email = Storage.getItem(USER_EMAIL_KEY) || '';
	}

	public setIsBug(bugVal: boolean) {
		this.setVal('isBug', bugVal);

	}

	public setEmail(newEmail: string) {
		if(this.setVal('email', newEmail)) {
			Storage.setItem(USER_EMAIL_KEY, newEmail);
		}
	}

	public setUserFeedback(newEmail: string) {
		this.setVal('feedback', newEmail);
	}

	public formatData(appStore: AppStore) {
		let debugData = '';

		if(this.isBug) {
			const appData = appStore.serialize();
			delete appData.transactions;
			debugData = JSON.stringify(appData);
		}

		return {
			created: moment().format('MM/DD/YYYY'),
			debugData,
			email: this.emailIsValid ? this.email : '',
			feedback: this.feedback,
			isBug: this.isBug,
		};
	}

	// TODO cleanup
	public stash(formattedData: any) {
		const feedback = Storage.getItem('queued-feedback') || [];
		feedback.push(formattedData);
		Storage.setItem('queued-feedback', feedback);
		this.closeForm();
	}

	@action public closeForm() {
		this.open = false;
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
			email,
			feedbackIsValid,
			emailIsValid,
			feedback,
			isBug,
			open,
		} = this.store;
		return (
			<div>
				{open && (
					<div>
						<p>
							Do you have some feedback?  Did you find a bug? Want to
							share say something nice (or mean!) with us?
						</p>
						<p>
							<TextField
								floatingLabelText="Email address"
								value={email}
								errorText={emailIsValid ? '' : 'Must be a vaid email'}
								onChange={(ev, val) => this.store.setEmail(val)}
								fullWidth
							/>
							<TextField
								fullWidth
								multiLine
								floatingLabelText="Feedback (required)"
								errorText={feedbackIsValid ? '' : `Must be at least ${MIN_FEEDBACK} character`}
								value={feedback}
								onChange={(ev, val) => this.store.setUserFeedback(val)}
							/>
							<Checkbox
								checked={isBug}
								onCheck={(ev, val) => this.store.setIsBug(val)}
								label="I'm reporting a bug"
							/>
						</p>
						<p>
							<RaisedButton
								primary
								fullWidth
								disabled={!this.store.isValid}
								label="Submit"
								onClick={() => this.handleSubmit()}
							/>
						</p>
					</div>
				) || (
					<div>
						Thank you for your feedback!
					</div>
				)}
			</div>
		);
	}

	public handleSubmit() {
		const formattedData = this.store.formatData(this.props.appStore);

		submitFeedback(formattedData)
			.then(() => this.store.closeForm())
			.catch(() => this.store.stash(formattedData));
	}
}
