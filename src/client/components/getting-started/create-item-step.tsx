import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Account from '../../stores/account';
import AppStore from '../../stores/app';
import ScheduledTransaction from '../../stores/scheduled-transaction';

type Model = Account | ScheduledTransaction;

class State<ModelType> {
	@observable public activeItem: ModelType | null = null;
	@computed get itemIsOpen() {
		return !!this.activeItem;
	}
	@action public editItem(item: ModelType) {
		this.activeItem = item;
	}
	@action public closeItem() {
		this.activeItem = null;
	}
}

interface Props<ModelType> {
	listComponent: any; // new() => Component<{}, {}>;
	listComponentProps?: any;
	editComponent: any;
	editComponentProps?: any;
	modelClass: any;
	items: ModelType[];
	appStore?: AppStore;
}

@inject('appStore') @observer
export default
class CreateAccountsStep<ModelType extends Model> extends React.Component<Props<ModelType>, State<ModelType>> {
	private store: State<ModelType>;

	constructor(props: Props<ModelType>) {
		super(props);
		this.store = new State<ModelType>();
	}

	public render() {
		const {
			appStore,
			items,
		} = this.props;
		const {
			activeItem,
			itemIsOpen,
		} = this.store;
		const ListComponent = this.props.listComponent;
		const EditComponent = this.props.editComponent;
		const listComponentProps = this.props.listComponentProps || {};
		const editComponentProps = this.props.editComponentProps || {};

		return (
			<div>
				<CSSTransitionGroup
					component="div"
					transitionName="page"
					transitionEnterTimeout={350}
					transitionLeaveTimeout={350}
				>
					{itemIsOpen && (
						<EditComponent
							{...editComponentProps}
							model={activeItem}
							style={{
								left: 0,
								position: 'fixed',
								top: 0,
								zIndex: 1200,
							}}
							onBack={() => this.handleCloseDialog()}
							onSave={() => this.handleSaveItem()}
						/>
					)}
				</CSSTransitionGroup>
				<ListComponent
					{...listComponentProps}
					items={items}
					showCreate
					onRemove={(itemModel: ModelType) => appStore.currentProfile.removeItem(itemModel)}
					onEdit={(itemModel: ModelType) => this.handleOpenItem(itemModel)}
					onOpenCreate={() => this.handleOpenItem()}
					store={appStore}
				/>
			</div>
		);
	}

	private handleOpenItem(itemModel?: ModelType) {
		itemModel = itemModel || new this.props.modelClass();
		this.store.editItem(itemModel);
	}

	private handleCloseDialog() {
		this.store.closeItem();
	}

	private handleSaveItem() {
		if(this.store.activeItem.isValid) {
			this.props.appStore.currentProfile.saveItem(this.store.activeItem);
			this.store.closeItem();
		}
	}
}
