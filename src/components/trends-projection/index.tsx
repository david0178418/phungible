import React, { useState, useEffect, useContext, useRef } from 'react';
import {
	IonButton,
	IonItem,
	IonLabel,
	IonInput,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/react';
import {
	format,
	parse,
	startOfDay,
	addMonths,
} from 'date-fns';
import {
	AccountsContext,
	ProfileContext,
	BudgetContext,
} from '@common/contexts';
import {
	ProfileCollection,
	RecurringTransaction,
} from '@shared/interfaces';
import { getProfileDocs } from '@common/api';
import {
	moneyFormat, generateColors,
} from '@shared/utils';
import { subMonths } from 'date-fns/esm';
import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
	ReferenceLine,
} from 'recharts';
import { generateBalanceHistory, foo } from './projection-fns';

import './trends-projection.scss';

export
function TrendsProjection() {
	const [fromDate, setFromDate] = useState(() => startOfDay(subMonths(new Date(), 1)));
	const [toDate, setToDate] = useState(() => startOfDay(addMonths(new Date(), 2)));
	const [data, setData] = useState<any[]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLIonInputElement | null>(null);
	const profile = useContext(ProfileContext);
	const accounts = useContext(AccountsContext);
	const budgets = useContext(BudgetContext);

	async function update() {
		if(!profile?.id) {
			return;
		}

		setLoading(true);

		const transactions = (await Promise.all(
			accounts.map(a => foo(a, fromDate, toDate)),
		)).flat();
		const recurringTransactions = await getProfileDocs<RecurringTransaction>(profile.id, ProfileCollection.RecurringTransactions);

		const d = await Promise.all(
			accounts.map((a) => generateBalanceHistory({
				account: a,
				from: fromDate,
				to: toDate,
				recurringTransactions,
				transactions,
				budgets,
			})),
		);

		const combinedHistory: any[] = [];

		for(let x = 0; x < d.length; x++) {
			for(let i = 0; i < d[x].length; i++) {
				combinedHistory[i] = {
					...combinedHistory[i],
					...d[x][i],
				};
			}
		}

		setData(combinedHistory);
		setLoading(false);
	}

	useEffect(() => {
		setColors(generateColors(accounts.length));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts]);

	useEffect(() => {
		update();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log(111, inputRef.current);
		inputRef.current?.getInputElement()
		.then(el => {
			el.setAttribute('list', 'ice-cream-flavors');
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputRef.current]);


	return (
		<div className="trends-projection">
			<p>
				<strong>
					Work in progress
				</strong>
			</p>
			<IonInput
				ref={inputRef}
				id="ice-cream-choice" name="ice-cream-choice" />
			<datalist id="ice-cream-flavors">
			</datalist>

			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								From
							</IonLabel>
							<IonInput
								type="date"
								value={format(fromDate, 'yyyy-MM-dd')}
								onIonChange={({detail}) =>{
									if(typeof detail.value === 'string') {
										detail.value && setFromDate(parse(detail.value, 'yyyy-MM-dd', new Date()));
									}
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								To
							</IonLabel>
							<IonInput
								type="date"
								value={format(toDate, 'yyyy-MM-dd')}
								onIonChange={({detail}) =>{
									if(typeof detail.value === 'string') {
										detail.value && setToDate(parse(detail.value, 'yyyy-MM-dd', new Date()));
									}
								}}
							/>
						</IonItem>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonButton onClick={update} expand="full">
				Update
			</IonButton>
			<div className="graph-container">
				<IonGrid>
					<IonRow>
						<IonCol>
							{!loading && !!data.length && (
								<ResponsiveContainer width="100%">
									<LineChart
										width={730}
										height={250}
										data={data}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip
											formatter={val => `$${moneyFormat(val as number)}`}
										/>
										<Legend />
										<ReferenceLine
											stroke="black"
											strokeDasharray="16 16"
											strokeWidth={3}
											x={format(new Date(), 'M/d/YYY')}
										/>

										{accounts.map((a, i) => (
											<Line
												key={a.id}
												type="monotone"
												stroke={colors[i]}
												dataKey={a.name}
											/>
										))}
									</LineChart>
								</ResponsiveContainer>
							)}
						</IonCol>
					</IonRow>
				</IonGrid>
			</div>
		</div>
	);
}
