declare module 'recharts' {
	export const BarChart: any;
		export const Bar: any;
		export const Tooltip: any;
		export const Legend: any;
		export const Area: any;
		export const AreaChart: any;
		export const LineChart: any;
		export const Line: any;
		export const XAxis: any;
		export const YAxis: any;
		export const CartesianGrid: any;
		export const ResponsiveContainer: any;
}

declare interface Array<T> {
	find(predicate: (search: T) => boolean) : T;
	findIndex(predicate: (search: T) => boolean) : number;
}
declare interface ObjectConstructor {
	assign(...objects: any[]): any;
}
interface String {
	endsWith(suffix: string): boolean;
	startsWith(suffix: string): boolean;
}
