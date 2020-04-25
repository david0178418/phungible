import React, { useRef, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
} from '@ionic/react';
import { moneyFormat, moneyParse } from '@shared/utils';

interface Props {
	amount: number;
	onUpdate(newAmount: number): void;
}

export
function MoneyInput(props: Props) {
	const inputRef = useRef<HTMLIonInputElement | null>(null);
	const [selectionStart, setSelectionStart] = useState(0);
	const [selectionEnd, setSelectionEnd] = useState(0);

	const {
		amount,
		onUpdate,
	} = props;

	async function handleFocus() {
		const input = await inputRef.current?.getInputElement();
		input?.select();
	}

	return (
		<IonItem>
			<IonLabel position="stacked" color="money">
				$
			</IonLabel>
			<IonInput
				ref={inputRef}
				inputMode="numeric"
				value={moneyFormat(amount, false)}
				onFocus={handleFocus}
				onIonChange={async ({detail}) => {
					const input = await inputRef.current?.getInputElement();
			
					if(!input) {
						return;
					}
			
					setSelectionStart(input.selectionStart || 0);
					setSelectionEnd(input.selectionEnd || 0);
					onUpdate(moneyParse(detail.value || '0'));
			
					setTimeout(() => {
						input?.setSelectionRange(selectionStart, selectionEnd);
					}, 0);
				}}
			/>
		</IonItem>
	);
}
