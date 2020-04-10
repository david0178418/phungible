import React, {
	useRef,
	useEffect,
	useState,
	ChangeEvent,
	useContext,
} from 'react';
import {
	IonFabButton,
	IonIcon,
	IonFabList,
} from '@ionic/react';
import {
	image,
	camera,
	receipt,
} from 'ionicons/icons';
import { UserContext, ProfileContext } from '@common/contexts';
import { uuid } from '@shared/utils';
import { alertController, loadingController } from '@ionic/core';
import { saveDoc } from '@common/api';
import { Collection, Transaction } from '@shared/interfaces';
import { createTransaction } from '@shared/create-docs';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';

function checkCaptureSupport() {
	return 'capture' in document.createElement('input');
}

interface ReceiptUploadButtonProps {
	transaction?: Transaction;
	onUpload?: (receiptUrls: string[]) => void;
}

export
function ReceiptUploadButton(props: ReceiptUploadButtonProps) {
	const user = useContext(UserContext);
	const profile = useContext(ProfileContext);
	const cameraEl = useRef<HTMLInputElement | null>(null);
	const fileEl = useRef<HTMLInputElement | null>(null);
	const [supportsCapture, setSupportsCapture] = useState(false);
	const history = useHistory();

	useEffect(() => {
		setSupportsCapture(checkCaptureSupport());
	}, []);
	
	async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];

		if(!file) {
			return;
		}

		const loader = await loadingController.create({
			message: 'Uploading 0%',
		});

		const { storage } = await import('@common/side-effect-storage-module');
		const ref = storage().ref();
		const child = ref.child(`${user?.uid}/${uuid()}-${file.name}`);
		const uploadTask = child.put(file);

		await loader.present();

		uploadTask.on('state_changed', (snap) => {
			const progress = ((snap.bytesTransferred / snap.totalBytes) * 100) | 0;
			loader.message = `Uploading ${progress}%`;
		});

		await uploadTask;
		
		const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

		if(props.transaction) {
			const receiptUrls = [downloadURL,
				...props.transaction.receiptUrls,
			];
			await saveDoc({
				...props.transaction,
				receiptUrls,
			}, Collection.Transactions);
			props.onUpload && props.onUpload(receiptUrls);
			loadingController.dismiss();
		} else if(profile?.id) {
			const newTransaction = await saveDoc<Transaction>({
					...createTransaction(profile.id),
					pending: true,
					receiptUrls: [downloadURL],
					date: (new Date()).toISOString(),
					name: `Expense - ${format(new Date(), 'dd/MM')}`,
				},
				Collection.Transactions,
			);
			await loadingController.dismiss();

			if(!newTransaction) {
				return;
			}

			const alert = await alertController.create({
				header: 'Receipt Saved',
				message:'Enter details now or later?',
				buttons: [
					{
						text: 'Later',
						role: 'cancel',
						cssClass: 'secondary',
					}, {
						text: 'Now',
						async handler() {
							alert.dismiss();
							history.push(`/transaction/${newTransaction.id}`);
						},
					},
				],
			});
	
			alert.present();
		}
	}

	return (
		<>
			<input
				ref={cameraEl}
				type="file"
				className="hidden"
				capture="environment"
				accept="image/*"
				onChange={uploadImage}
			/>
			<input
				ref={fileEl}
				type="file"
				className="hidden"
				accept="image/*"
				onChange={uploadImage}
			/>
			{supportsCapture && (
				<>
					<IonFabButton color="secondary">
						<IonIcon icon={receipt} />
					</IonFabButton>
					<IonFabList side="top">
						<IonFabButton onClick={() => cameraEl.current?.click()}>
							<IonIcon icon={camera} />
						</IonFabButton>
					</IonFabList>
					<IonFabList side="start">
						<IonFabButton onClick={() => fileEl.current?.click()}>
							<IonIcon icon={image} />
						</IonFabButton>
					</IonFabList>
				</>
			)}
			{!supportsCapture && (
				<IonFabButton color="secondary" onClick={() => fileEl.current?.click()}>
					<IonIcon icon={receipt} />
				</IonFabButton>
			)}
		</>
	);
}
