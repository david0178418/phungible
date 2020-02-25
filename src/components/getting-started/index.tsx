import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
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
	private completedSteps: Array<() => boolean>;

	constructor(props: Props) {
		super(props);
		this.store = new State();
		this.completedSteps = [
			() => true, // intro
			() => !!props.appStore.currentProfile.accounts.length,
			() => !!props.appStore.currentProfile.scheduledTransactions.length,
			() => !!props.appStore.currentProfile.budgets.length,
			() => true, // done
		];
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
		} = this.props.appStore.currentProfile;
		return (
			<div>
				<Stepper activeStep={stepIndex} orientation="vertical">
					<Step>
						<StepLabel>Welcome</StepLabel>
						<StepContent>
							<p>
								Thank you for using <em>Phungible</em>!
							</p>
							<p>
								We aim to provide simple budget management that doesn't
								require an accounting degree or giving up any sensitive account details.
							</p>
							<p>
								Budget planning is hard.  <em>Phungible</em> aims to make
								planning easier by allowing you to take control of your financial future if you stick to your plan today.
							</p>
							<p>
								Let's get started!
							</p>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Accounts</StepLabel>
						<StepContent>
							<small>
								<em>Accounts</em> are simply buckets for money and debts.
								They can be a bank account, credit card, or even your wallet.
							</small>
							<hr/>
							<CreateAccountsStep
								items={accounts}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Recurring Transactions</StepLabel>
						<StepContent>
							<small>
								<em>Recurring Transactions</em> happen at a known interval
								and at a fixed amount, such as payday or a car insurance payment.
							</small>
							<hr/>
							<CreateScheduledTransactionsStep
								items={scheduledTransactions}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Add Budgets</StepLabel>
						<StepContent>
							<small>
								<em>Budgets</em> are spending categories that are less known
								ahead of time, but that you want limit for a given period.
								Examples would be dining out, games, or clothes.
							</small>
							<hr/>
							<CreateBudgetsStep
								items={budgets}
							/>
						</StepContent>
					</Step>
					<Step>
						<StepLabel>Finish</StepLabel>
						<StepContent>
									You're all done.  Enjoy!
								<p>
									However, if you'd like a few additional notes
									on how things work, keep reading.  But you
									can always go through the <em>Help</em> section later.
								</p>
								<p>
									<em>Recurring Transactions</em> and <em>Budgets</em> are the plan for how
									money from your accounts will be
									saved/spent.
									The <em>Trends</em> page predicts the amount
									that will be available in your accounts,
									assuming you keep to this plan.
								</p>
								<p>
									<em>Transactions</em> are the <strong>real</strong> record of your
									spending.  <em>Recurring Transactions</em> will
									automatically create <em>Transactions</em> on the dates they
									occur.
								</p>
								<p>
									<em>Budgets</em> have <em>Transactions</em> filed against them.
									When making projections on <em>Account</em> balances, it is assumed you will spend
									the entire amount.  If more is spent than
									budgeted for a given period, that budget
									is ignored until the next period.
								</p>
								<p>
									Of course, no plan is perfect.  Unexpected
									expenses will happen.  For those, one-off
									transactions can be made
								</p>
						</StepContent>
					</Step>
				</Stepper>
				<Paper
					style={{
						bottom: 0,
						left: 0,
						padding: 10,
						position: 'fixed',
						width: '100%',
						zIndex: 2,
					}}
					transitionEnabled={false}
				>
					<FlatButton
						label="Back"
						disabled={firstStep}
						onClick={() => this.handlePrev()}
						style={{
							marginRight: 10,
						}}
					/>
					<RaisedButton
						primary
						disabled={!this.stepComplete()}
						label={lastStep ? 'Finish' : 'Next'}
						onClick={() => this.handleNext()}
					/>
					{!lastStep && (
						<FlatButton
							label="skip"
							onClick={() => this.handleFinish()}
						/>
					)}
				</Paper>
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

	private stepComplete() {
		return this.completedSteps[this.store.stepIndex]();
	}
}
