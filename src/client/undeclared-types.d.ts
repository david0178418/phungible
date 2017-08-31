declare const API_URI: string;
declare const VERSION: string;

declare module 'item-type-name' {
	type ItemTypeName = 'Account' | 'Budget' | 'Recurring Transaction' | 'Transaction';
	export default ItemTypeName;
}

declare module 'material-ui-icons/MoreVert' {
	const x: any;
	export = x;
}

declare module 'recharts' {
	export const Area: any;
	export const AreaChart: any;
	export const CartesianGrid: any;
	export const Bar: any;
	export const BarChart: any;
	export const Legend: any;
	export const Line: any;
	export const LineChart: any;
	export const ReferenceLine: any;
	export const ResponsiveContainer: any;
	export const Tooltip: any;
	export const XAxis: any;
	export const YAxis: any;
}

declare module 'secure-ls' {
	const x: any;
	export = x;
}

declare interface Array<T> {
	find(predicate: (search: T) => boolean): T;
	findIndex(predicate: (search: T) => boolean): number;
}
declare interface ObjectConstructor {
	assign(...objects: any[]): any;
}
declare interface String {
	endsWith(suffix: string): boolean;
	startsWith(suffix: string): boolean;
}

declare module 'react-transition-group/CSSTransitionGroup' {
	import { ComponentClass, Props, ReactElement, ReactType } from 'react';

	interface TransitionNameSimpleObject {
		enter?: string;
		leave?: string;
		active?: string;
	}

	interface TransitionNameFullObject extends TransitionNameSimpleObject {
	enterActive?: string;
	leaveActive?: string;
	activeActive?: string;
	}

	interface TransitionGroupPropsBase extends Props<any> {
	component?: ReactType;
	}

	interface TransitionGroupProps extends TransitionGroupPropsBase {
	childFactory?: (child: ReactElement<any>) => ReactElement<any>;
	}

	interface CSSTransitionGroupProps extends TransitionGroupPropsBase {
	transitionName: string | TransitionNameSimpleObject | TransitionNameFullObject;
	transitionAppear?: boolean;
	transitionEnter?: boolean;
	transitionLeave?: boolean;
	transitionAppearTimeout?: number;
	transitionEnterTimeout?: number;
	transitionLeaveTimeout?: number;
	}

	type TransitionGroup = ComponentClass<TransitionGroupProps>;
	type CSSTransitionGroup = ComponentClass<CSSTransitionGroupProps>;

	const CSSTransitionGroup: CSSTransitionGroup;
	export = CSSTransitionGroup;
}

declare module 'navigo' {
	const x: any;
	export = x;
}

interface NavigoHooks {
	before?(done: (suppress?: boolean) => void): void;
	after?(): void;
}
type RouteHandler = ((parametersObj: any, query: string) => void) | { as: string; uses(parametersObj: any): void };

declare class Navigo {
	/**
	 * Constructs the router
	 * @param root The main URL of your application.
	 * @param useHash If useHash set to true then the router uses an old
	 * routing approach with hash in the URL. Navigo anyways falls back to
	 * this mode if there is no History API supported.
	 */
	constructor(root?: string | null, useHash?: boolean);

	public on(location: string, handler: RouteHandler, hooks?: NavigoHooks): Navigo;
	public on(location: RegExp, handler: (...parameters: string[]) => void, hooks?: NavigoHooks): Navigo;
	public on(routes: { [key: string]: RouteHandler }): Navigo;

	public on(rootHandler: RouteHandler, hooks?: NavigoHooks): Navigo;

	public notFound(handler: ((query: string) => void), hooks?: NavigoHooks): void;

	public navigate(path: string, absolute?: boolean): void;

	public updatePageLinks(): void;

	public generate(path: string, params?: any): string;

	public resolve(currentURL?: string): boolean;

	public link(path: string): string;

	public disableIfAPINotAvailable(): void;

	public pause(): void;

	public resume(): void;

	public destroy(): void;
}

declare module 'pouchdb-authentication' {
	const x: any;
	export = x;
}
