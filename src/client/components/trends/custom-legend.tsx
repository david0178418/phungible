import {observer} from 'mobx-react';
import {Component} from 'react';
import * as React from 'react';

type Line = {
	color: string;
	value: string;
};

type Props = {
	payload?: Line[];
};

function filterProjections(lines: Line[]) {
	return lines.filter((line) => line.value.indexOf('(projection)') === -1);
}

@observer
export default
class CustomLegend extends Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	public render() {
		const filteredPayload = filterProjections(this.props.payload);
		return (
			<ul
				className="recharts-default-legend"
				style={{
					margin: 0,
					padding: 0,
					textAlign: 'center',
				}}
			>
				{filteredPayload.map((line) => {
					return (
						<li
							key={line.value}
							className="recharts-legend-item legend-item-0"
							style={{
								display: 'inline-block',
								marginRight: 10,
							}}
						>
							<svg
								className="recharts-surface"
								width="14"
								height="14"
								viewBox="0 0 32 32"
								version="1.1"
								style={{
									display: 'inline-block',
									marginRight: 4,
									verticalAlign: 'middle',
								}}
							>
								<path
									strokeWidth="4"
									fill="none"
									stroke={line.color}
									d={`M0,16h10.666666666666666
										A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
										H32M21.333333333333332,16
										A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16`}
									className="recharts-legend-icon"
								/>
							</svg>
							<span
								className="recharts-legend-item-text"
							>
								{line.value}
							</span>
						</li>
					);
				})}
			</ul>
		);
	}
}
