import React from 'react';
import {
	IonLabel,
	IonGrid,
	IonRow,
	IonCol,
	IonItem,
	IonInput,
	IonSelect,
	IonSelectOption,
} from '@ionic/react';
import { RepeatUnit } from '../../../interfaces';

interface Props {
	value: number;
	unit: RepeatUnit;
	onValueChange: (value: number) => void;
	onUnitChange: (unit: RepeatUnit) => void;
}

export
function IntervalSelector(props: Props) {
	const {
		value,
		unit,
		onUnitChange,
		onValueChange,
	} = props;

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonCol size="3">
						<IonItem>
							<IonLabel position="stacked">
								Every
							</IonLabel>
							<IonInput
								value={value}
								type="number"
								min="1"
								onIonChange={({detail}) => detail.value && onValueChange(+detail.value)}
							/>
						</IonItem>
					</IonCol>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked"></IonLabel>
							<IonSelect
								value={unit}
								onIonChange={({detail}) => onUnitChange(detail.value)}
							>
								<IonSelectOption value={RepeatUnit.Day}>
									Day
								</IonSelectOption>
								<IonSelectOption value={RepeatUnit.Week}>
									Week
								</IonSelectOption>
								<IonSelectOption value={RepeatUnit.Month}>
									Month
								</IonSelectOption>
								<IonSelectOption value={RepeatUnit.Year}>
									Year
								</IonSelectOption>
							</IonSelect>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonGrid>
		</>
	);
}
