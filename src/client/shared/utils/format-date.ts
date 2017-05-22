import * as moment from 'moment';

export default
function formatDate(date: Date) {
	return moment(date).format('MMMM D, YYYY');
}
