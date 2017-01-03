export
class BudgetEntry {
	public amount: number;
	public exceptions: string[];
	public labels: string[];
	public name: string;
	public repeatValue: number = 1;
	public repeatUnit: RepeatUnits = RepeatUnits.Month;
	public startDate: string;
};

export
const enum RepeatUnits {
	Day,
	Week,
	Month,
	Year,
	None,
};
