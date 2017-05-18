export default
class Analytics {
	public static logScreenView(screenName: string) {
		const fields: any = {
			screenName,
		};
		(window as any).ga('send', 'screenview', fields);
	}
}
