(window as any).ga('set', 'appVersion', VERSION);

export default
class Analytics {
	public static logScreenView(title: string, path: string) {
		const fields: any = {
			hitType: 'pageview',
			page: path,
			title,
		};
		(window as any).ga('send', fields);
	}
}
