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
	data: DayBalances[];
	accountNames: string[];
};

function pickColor(index: number) {
	return LineColors[index % LineColors.length];
}

export default
function TrendsChart({data, accountNames}: Props) {
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
					<Line
						dataKey="Total"
						key="Total"
						stroke="#000"
						type="monotone"
					/>
					{accountNames.map((name, index) => (
						<Line
							dataKey={name}
							key={name}
							stroke={pickColor(index)}
							type="monotone"
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
