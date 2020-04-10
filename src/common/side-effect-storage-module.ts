// Massive hack to defer loading of firebase's massive modules
// Watch ticket to determine when this can be refactored:
// https://github.com/firebase/firebase-js-sdk/issues/2241
import 'firebase/storage';
import { storage } from 'firebase/app';

type UploadTask = storage.UploadTask;

export {
	UploadTask,
	storage,
};
