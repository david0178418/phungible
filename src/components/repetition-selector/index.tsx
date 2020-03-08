import React from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonGrid,
	IonRow,
	IonCol,
	IonSegment,
	IonSegmentButton,
	IonCheckbox,
} from '@ionic/react';
import { WeekdaySelector } from './components/weekday-selector';

import './repetition-selector.scss';
import { RepeatType } from '../../interfaces';

interface Props {
	type: RepeatType | null;
	values: number[];
	onUpdate: (type: RepeatType | null, values: number[]) => void;
}

export
function RepetitionSelector(props: Props) {
	const {
		type,
		values,
		onUpdate,
	} = props;

	function handleValueToggle(toggleValue: number) {
		let newVal = values.includes(toggleValue) ?
			values.filter(v => v !== toggleValue) :
			[...values, toggleValue];
			
		onUpdate(type, newVal.sort());
	}

	function handleTypeUpdate(newType: RepeatType) {
		if(newType === type) {
			return;
		}

		onUpdate(newType, []);
	}

	function handleRepeatToggle() {
		const newType = type ? null : RepeatType.Days;

		onUpdate(newType, []);
	}

	return (
		<>
			<IonItem>
				<IonLabel>
					Repeats
				</IonLabel>
				<IonCheckbox
					slot="start"
					checked={!!type}
					onIonChange={() => handleRepeatToggle()}
				/>
			</IonItem>
			{type && (
				<>
					<IonSegment
						color="primary"
						value={type}
						onIonChange={({detail}) => handleTypeUpdate(detail.value as RepeatType)}
					>
						<IonSegmentButton value={RepeatType.Days}>
							Day
						</IonSegmentButton>
						<IonSegmentButton value={RepeatType.Dates}>
							Date
						</IonSegmentButton>
						<IonSegmentButton value={RepeatType.Interval}>
							Interval
						</IonSegmentButton>
					</IonSegment>

					{RepeatType.Days === type && (
						<WeekdaySelector
							checkedDays={values}
							onDayToggle={handleValueToggle}
						/>
					)}
					{RepeatType.Dates === type && (
						'Date View'
					)}
					{RepeatType.Interval === type && (
						<>
							<IonLabel>
								<p>
									Every
								</p>
							</IonLabel>
							<IonGrid>
								<IonRow>
									<IonCol size="2">
										<IonItem>
											<IonInput value={0} type="number" />
										</IonItem>
									</IonCol>
									<IonCol>
										<IonItem>
											<IonSelect>
												<IonSelectOption>
													Day
												</IonSelectOption>
												<IonSelectOption>
													Week
												</IonSelectOption>
												<IonSelectOption>
													Month
												</IonSelectOption>
												<IonSelectOption>
													Year
												</IonSelectOption>
											</IonSelect>
										</IonItem>
									</IonCol>
								</IonRow>
							</IonGrid>
						</>
					)}
				</>
			)}
		</>
	);
}
