import { Workbox, messageSW} from 'workbox-window';
import { WorkboxLifecycleWaitingEvent } from 'workbox-window/utils/WorkboxEvent';
import { toastController } from '@ionic/core';

export
function init() {
	const wb = new Workbox('/service-worker.js');
	// Add an event listener to detect when the registered
	// service worker has installed but is waiting to activate.
	wb.addEventListener('waiting', showSkipWaitingPrompt);
	wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

	wb.register();

	async function showSkipWaitingPrompt(event: WorkboxLifecycleWaitingEvent) {
		// `event.wasWaitingBeforeRegister` will be false if this is
		// the first time the updated service worker is waiting.
		// When `event.wasWaitingBeforeRegister` is true, a previously
		// updated service worker is still waiting.
		// You may want to customize the UI prompt accordingly.
	
		// Assumes your app has some sort of prompt UI element
		// that a user can either accept or reject.
		const toast = await toastController.create({
			message: 'An update is available!',
			buttons: [{
				text: 'Update',
				role: 'cancel',
				handler: () => {
					toast.dismiss();
					upgrade(event);
				},
			}, {
				text: 'Dismiss',
				role: 'cancel',
			}],
		});
	
		await toast.present();
	}

	async function upgrade(event: WorkboxLifecycleWaitingEvent) {
		// Assuming the user accepted the update, set up a listener
		// that will reload the page as soon as the previously waiting
		// service worker has taken control.
		wb.addEventListener('controlling', () => {
			window.location.reload();
		});

		// Send a message to the waiting service worker instructing
		// it to skip waiting, which will trigger the `controlling`
		// event listener above.
		// Note: for this to work, you have to add a message
		// listener in your service worker. See below.

		if(event.sw) {
			messageSW(event.sw, {type: 'SKIP_WAITING'});
		}

		const toast = await toastController.create({
			duration: 3000,
			message: 'Phungible will reload once upgrade is complete.',
			buttons: [{
				text: 'Dismiss',
				role: 'cancel',
			}],
		});

		await toast.present();
		return true;
	}
}
