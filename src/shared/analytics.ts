const {
	// tslint:disable-next-line: no-empty
	ga = (...args: any[]) => {},
} = (window as any);

ga('set', 'appVersion', VERSION);

export default
class Analytics {
	public static logScreenView(title: string, path: string) {
		const fields: any = {
			hitType: 'pageview',
			page: path,
			title,
		};
		ga('send', fields);
	}
}
