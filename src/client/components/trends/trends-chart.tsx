import * as moment from 'moment';
import * as React from 'react';
import {Component} from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import Money from '../../shared/utils/money';

const LineColors = [
	'#e41a1c',
	'#377eb8',
	'#4daf4a',
	'#984ea3',
	'#ff7f00',
	'#4fe7ff',
	'#a65628',
	'#f781bf',
];

type DayBalances = any & {
	name: string;
};
type Props = {
	allTrendNames: string[];
	animate: boolean;
	data: DayBalances[];
	trendNames: string[];
	onAnimationEnd(): void;
};
type State = {
	assignedColors: {
		[key: string]: string;
	},
};

export default
class TrendsChart extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			assignedColors: {},
		};

		this.assignColors();
	}

	public render() {
		const {
			animate,
			data,
			onAnimationEnd,
			trendNames,
		} = this.props;

		return (
			<div style={{
				height: 400,
				margin: '10px 0 0 -15px', // Style hack to make better use of mobile space
			}}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{top: 20}}>
						<XAxis dataKey="date"/>
						<YAxis
							width={70}
							tickFormatter={(val: number) => Money.formatMoney(val / 100, 0)}
						/>
						<Tooltip
							animationDuration={100}
							formatter={(val: number) => Money.formatMoney(val / 100)}
						/>
						<ReferenceLine
							label="Today"
							stroke="black"
							strokeDasharray="16 16"
							strokeWidth={5}
							x={moment().format('MMM DD')}
						/>
						<CartesianGrid strokeDasharray="3 3" />
						<Legend />
						{trendNames.map((name, index) => {
							const color = this.state.assignedColors[name];
							const animationDuration = animate ? 1000 : 0;
							return (
								<Line
									animationDuration={animationDuration}
									dataKey={name}
									dot={false}
									key={name}
									onAnimationEnd={onAnimationEnd}
									stroke={color}
									strokeWidth="3"
								/>
							);
						})}
					</LineChart>
				</ResponsiveContainer>
			</div>
		);
	}

	private assignColors() {
		let assignedCount = 0;
		this.props.allTrendNames.forEach((trendName) => {
			if(this.state.assignedColors[trendName]) {
				return;
			}

			this.state.assignedColors[trendName] = LineColors[assignedCount];
			assignedCount++;
		});
	}
}
