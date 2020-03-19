import React from 'react';
import Stepper, { Step } from 'react-material-stepper';
import { IonPage } from '@ionic/react';
import 'react-material-stepper/dist/react-stepper.css';

export
function GettingStartedPage() {
	return (
		<IonPage>
			<Stepper>
				<Step
					stepId="step-1"
					data="Step 1 initial state"
					title="Step One"
					description="This step is optional"
				>
					Foo
				</Step>
				<Step
					stepId="step-2"
					title="Step Two"
					description="Login is required"
				>
					Bar
				</Step>
				<Step
					stepId="step-3"
					title="Step Three"
				>
					Baz
				</Step>
			</Stepper>
		</IonPage>
	);
}

export default GettingStartedPage;
