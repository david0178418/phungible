export
class BudgetItem {
	public amount: number;
	public exceptions: string[];
	public labels: string[];
	public name: string;
	public type: RepeatInterval;
	public startDate: string;
};

export
const enum RepeatInterval {
	Daily,
	Weekdays,
	Weekly,
	Monthly,
	Yearly,
	None,
};
