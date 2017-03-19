import * as React from 'react';
import {Component} from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import Money from '../../shared/utils/money';

const BREAK_SIZE = 6;
const DASH_SIZE = 6;
const LineColors = [
	'#e41a1c',
	'#377eb8',
	'#4daf4a',
	'#984ea3',
	'#ff7f00',
	'#ffff33',
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
				margin: '10px 0 0 -50px', // Style hack to make better use of mobile space
			}}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<XAxis dataKey="date"/>
						<YAxis
							width={70}
							tickFormatter={(val: number) => Money.formatMoney(val / 100, 0)}
						/>
						<Tooltip
							animationDuration={100}
							formatter={(val: number) => Money.formatMoney(val / 100)}
						/>
						<CartesianGrid strokeDasharray="3 3"/>
						<Legend />
						{trendNames.map((name, index) => {
							const colorKey = name.split(' (projection)')[0];
							const color = this.state.assignedColors[colorKey];
							const animationDuration = animate ? 1000 : 0;
							const isProjection: boolean = (name as any).endsWith('(projection)');
							return (
								<Line
									animationDuration={animationDuration}
									dataKey={name}
									dot={false}
									isAnimationActive={!isProjection}
									key={name}
									onAnimationEnd={onAnimationEnd}
									stroke={color}
									strokeDasharray={isProjection ? `${DASH_SIZE} ${BREAK_SIZE}` : ''}
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
			if(trendName.endsWith('(projection)') || this.state.assignedColors[trendName]) {
				return;
			}

			this.state.assignedColors[trendName] = LineColors[assignedCount];
			assignedCount++;
		});
	}
}
