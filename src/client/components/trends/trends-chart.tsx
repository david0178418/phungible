import * as React from 'react';
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

const style = {
	height: 400,
};
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
	animate: boolean;
	data: DayBalances[];
	onAnimationEnd(): void;
	trendNames: string[];
};

function pickColor(index: number) {
	return LineColors[index % LineColors.length];
}

export default
function TrendsChart({animate, data, onAnimationEnd, trendNames}: Props) {
	const animationDuration = animate ? 1000 : 0;

	return (
		<div style={style}>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
				>
					<XAxis dataKey="date"/>
					<YAxis/>
					<Tooltip />
					<CartesianGrid strokeDasharray="3 3"/>
					<Legend />
					{trendNames.map((name, index) => (
						<Line
							animationDuration={animationDuration}
							dataKey={name}
							key={name}
							onAnimationEnd={onAnimationEnd}
							stroke={pickColor(index)}
							type="monotone"
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
