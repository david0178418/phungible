import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
	Step,
	StepContent,
	StepLabel,
	Stepper,
} from 'material-ui/Stepper';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import AppStore from '../../stores/app';

import CreateAccountsStep from './create-accounts-step';
import CreateBudgetsStep from './create-budgets-step';
import CreateScheduledTransactionsStep from './create-scheduled-transactions-step';

class State {
	public static stepCount = 5;
	@observable public stepIndex = 0;

	@computed get finished() {
		return this.stepIndex >= State.stepCount;
	}

	@computed get firstStep() {
		return this.stepIndex === 0;
	}

	@computed get lastStep() {
		return this.stepIndex === State.stepCount - 1;
	}

	@action public nextStep() {
		if(!this.lastStep) {
			this.stepIndex++;
		}
	}

	@action public prevStep() {
		if(!this.firstStep) {
			this.stepIndex--;
		}
	}
}

interface Props {
	appStore?: AppStore;
	router?: Navigo;
}

@inject('appStore', 'router')
@observer
export default
class GettingStarted extends React.Component<Props, State> {
	private store: State;

	constructor(props: Props) {
		super(props);
		this.store = new State();
	}

	public render() {
		const {
			firstStep,
			lastStep,
			stepIndex,
		} = this.store;
		const {
			accounts,
			budgets,
			scheduledTransactions,
		} = this.props.appStore;
		return (
			<div>
				<Stepper activeStep={stepIndex} orientation="vertical">
					<Step>
						<StepLabel>Welcome</StepLabel>
						<StepContent>
							Introduction text here...
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Add Accounts</StepLabel>
						<StepContent>
							<CreateAccountsStep
								accounts={accounts}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Add Recurring Transactions</StepLabel>
						<StepContent>
							<CreateScheduledTransactionsStep
								scheduledTransactions={scheduledTransactions}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Add Budgets</StepLabel>
						<StepContent>
							<CreateBudgetsStep
								budgets={budgets}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Finish</StepLabel>
						<StepContent>
							All done!
						</StepContent>
					</Step>
				</Stepper>
				<div>
					<FlatButton
						label="Back"
						disabled={firstStep}
						onTouchTap={() => this.handlePrev()}
					/>
					<RaisedButton
						primary
						label={lastStep ? 'Finish' : 'Next'}
						onTouchTap={() => this.handleNext()}
					/>
					<FlatButton
						label="skip"
						onTouchTap={() => this.handleFinish()}
					/>
				</div>
			</div>
		);
	}

	private handleFinish() {
		this.props.router.navigate('/');
	}

	private handleNext() {
		if(this.store.lastStep) {
			this.handleFinish();
		} else {
			this.store.nextStep();
		}
	}

	private handlePrev() {
		this.store.prevStep();
	}
}
