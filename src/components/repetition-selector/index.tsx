import React from 'react';
import {
	IonItem,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonCheckbox,
} from '@ionic/react';
import { RepeatType, RepeatUnit } from '@common/interfaces';
import { DateSelector } from './components/date-selector';
import { IntervalSelector } from './components/interval-selector';
import { WeekdaySelector } from './components/weekday-selector';

import './repetition-selector.scss';
import { nextOccuranceText } from '@common/budget-fns';

interface Props {
	date: string,
	type: RepeatType | null;
	values: number[];
	unit: RepeatUnit;
	onUpdate: (type: RepeatType | null, values: number[], units?: RepeatUnit) => void;
}

export
function RepetitionSelector(props: Props) {
	const {
		date,
		type,
		values,
		unit,
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

		const vals = newType === RepeatType.Interval ? [1] : [];

		onUpdate(newType, vals);
	}

	function handleRepeatToggle() {
		const newType = type ? null : RepeatType.Days;

		onUpdate(newType, []);
	}

	function handleIntervalValueChange(val: number) {
		onUpdate(type, [val]);
	}

	function handleUnitChange(newUnit: RepeatUnit) {
		onUpdate(type, values, newUnit);
	}

	return (
		<>
			<IonItem lines="none">
				<IonCheckbox
					slot="start"
					checked={!!type}
					onIonChange={handleRepeatToggle}
				/>
				<IonLabel>
					Repeats
					<p>
						Next occurance in {nextOccuranceText({
							date,
							repeatType: type,
							repeatUnit: unit,
							repeatValues: values,
						})}
					</p>
				</IonLabel>
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
						<DateSelector
							checkedDays={values}
							onDateToggle={handleValueToggle}
						/>
					)}
					{RepeatType.Interval === type && (
						<>
							<IntervalSelector
								value={values[0]}
								unit={unit}
								onValueChange={handleIntervalValueChange}
								onUnitChange={handleUnitChange}
							/>
						</>
					)}
				</>
			)}
		</>
	);
}
