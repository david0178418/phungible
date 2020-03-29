import React, { useEffect, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonButton,
	IonList,
	IonItemSliding,
} from '@ionic/react';
import {
	startOfDay,
	format,
	parse,
} from 'date-fns';
import { useParams, useHistory } from 'react-router-dom';
import equal from 'fast-deep-equal';
import { cashOutline, trash, cardOutline } from 'ionicons/icons';
import { EditPage } from '@components/edit-page';
import { createAccount, getDoc, saveProfileDoc } from '@common/api';
import { Collection, Account, AccountType } from '@common/interfaces';
import { MoneyInput } from '@components/money-input';
import { moneyFormat } from '@common/utils';

export
function AccountEditPage() {
	const [originalAccount, setOriginalAccount] = useState(createAccount);
	const [account, setAccount] = useState(createAccount);
	const [hasChanged, setHasChanged] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [balanceAmount, setBalanceAmount] = useState(0);
	const [balanceDate, setBalanceDate] = useState(() =>
		startOfDay(new Date()),
	);
	const {goBack} = useHistory();
	const {
		id = '',
	} = useParams();
	const [loading, setLoading] = useState(!!id);

	useEffect(() => {
		setHasChanged(!equal(account, originalAccount));
	}, [account, originalAccount]);

	useEffect(() => {
		setIsValid(hasChanged && canSave());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasChanged, account]);

	useEffect(() => {
		(async () => {
			if(id) {
				const a = await getDoc<Account>(`${Collection.Accounts}/${id}`);
				if(a) {
					setOriginalAccount(a);
					setAccount(a);
				}
			}
			setLoading(false);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	function canSave() {
		const {
			name,
			balanceUpdateHistory,
		} = account;
		return !!(
			name &&
			balanceUpdateHistory.length
		);
	}

	async function handleSubmit() {
		if(!isValid) {
			return;
		}

		const result = await saveProfileDoc(account, Collection.Accounts);
		result && goBack();
	}

	function addBalanceItem() {
		setAccount({
			...account,
			balanceUpdateHistory: [
				...account.balanceUpdateHistory,
				{
					balance: balanceAmount,
					date: balanceDate.toISOString(),
				},
			].sort(
				(a, b) => b.date.localeCompare(a.date),
			),
		});
		setBalanceAmount(0);
		setBalanceDate(startOfDay(new Date()));
	}

	function removeBalanceItem(index: number) {
		setAccount({
			...account,
			balanceUpdateHistory: account
				.balanceUpdateHistory
				.filter((a, i) => i !== index),
		});
	}

	return (
		<EditPage
			editing={!!id}
			defaultHref="/accounts"
			canSave={isValid}
			loading={loading}
			onSubmit={handleSubmit}
		>
			<IonItem>
				<IonLabel position="stacked">
					Name
				</IonLabel>
				<IonInput
					value={account.name}
					onIonChange={({detail}) => {
						typeof detail.value === 'string' &&
						setAccount({
							...account,
							name: detail.value,
						});
					}}
				/>
			</IonItem>
			<IonItem>
				<div slot="start">
					{account.type ===  AccountType.Savings && (
						<IonIcon
							slot="start"
							color="money"
							icon={cashOutline}
						/>
					)}
					{account.type ===  AccountType.Debt && (
						<IonIcon
							slot="start"
							color="debt"
							icon={cardOutline}
						/>
					)}
				</div>
				<IonSelect
					interface="popover"
					placeholder="Type"
					className="wide"
					value={account.type}
					onIonChange={({detail}) =>
						setAccount({
							...account,
							type: detail.value,
						})
					}
				>
					<IonSelectOption value={AccountType.Savings}>
						Available Cash
					</IonSelectOption>
					<IonSelectOption value={AccountType.Debt}>
						Debt
					</IonSelectOption>
				</IonSelect>
			</IonItem>
			<IonItem>
				<IonLabel position="stacked">
					Notes
				</IonLabel>
				<IonInput
					value={account.notes}
					onIonChange={({detail}) =>
						typeof detail.value === 'string' &&
						setAccount({
							...account,
							notes: detail.value,
						})
					}
				/>
			</IonItem>
			<IonGrid>
				<IonRow>
					<IonCol>
						<IonItem>
							<IonLabel position="stacked">
								Balance at start of
							</IonLabel>
							<IonInput
								type="date"
								value={format(balanceDate, 'yyyy-MM-dd')}
								onIonChange={({detail}) =>{
									if(typeof detail.value === 'string') {
										detail.value && setBalanceDate(parse(detail.value, 'yyyy-MM-dd', new Date()));
									}
								}}
							/>
						</IonItem>
					</IonCol>
					<IonCol size="3">
						<MoneyInput
							amount={balanceAmount}
							onUpdate={amount => {
								setBalanceAmount(amount);
							}}
						/>
					</IonCol>
				</IonRow>
			</IonGrid>
			<IonButton expand="full" onClick={addBalanceItem}>
				Add Balance
			</IonButton>
			<IonItem lines="none">
				<IonLabel>
					<p>
						Account Balance History
					</p>
				</IonLabel>
			</IonItem>
			{!account.balanceUpdateHistory.length && (
				<IonItem lines="none">
					<IonLabel color="danger">
						At least one account balance update required.
					</IonLabel>
				</IonItem>
			)}
			<IonList>
				{account.balanceUpdateHistory.map((a, i) => (
					<IonItemSliding key={i}>
						<IonItem>
							<IonLabel>
								${moneyFormat(a.balance)}
								<p>
									as of {a.date}
								</p>
							</IonLabel>
							<IonButton
								slot="end"
								fill="clear"
								onClick={() => removeBalanceItem(i)}
							>
								<IonIcon
									slot="icon-only"
									icon={trash}
								/>
							</IonButton>
						</IonItem>
					</IonItemSliding>
				))}
			</IonList>
		</EditPage>
	);
}

export default AccountEditPage;
