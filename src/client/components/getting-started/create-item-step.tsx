import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import ItemTypeName from 'item-type-name';
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
	typeName: ItemTypeName;
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
			typeName,
		} = this.props;
		const ListComponent = this.props.listComponent;
		const EditComponent = this.props.editComponent;
		const listComponentProps = this.props.listComponentProps || {};
		const editComponentProps = this.props.editComponentProps || {};

		return (
			<div>
				<ListComponent
					showCreate
					{...listComponentProps}
					items={items}
					onRemove={(itemModel: ModelType) => appStore.removeItem(itemModel, typeName)}
					onEdit={(itemModel: ModelType) => this.handleOpenItem(itemModel)}
					onOpenCreate={() => this.handleOpenItem()}
					store={appStore}
				/>
				<Dialog
					style={{
						paddingTop: 0,
					}}
					contentStyle={{
						maxWidth: 750,
						width: '100%',
					}}
					autoScrollBodyContent
					open={this.store.itemIsOpen}
					title={`Create ${typeName}`}
					actions={[
						<FlatButton
							label="Cancel"
							onTouchTap={() => this.handleCloseDialog()}
						/>,
						<RaisedButton
							primary
							disabled={this.store.itemIsOpen && !this.store.activeItem.isValid}
							label="Save"
							onTouchTap={() => this.handleSaveItem()}
						/>,
					]}
				>
					<EditComponent
						{...editComponentProps}
						model={this.store.activeItem}
						onSubmit={() => this.handleSaveItem()}
					/>
				</Dialog>
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
			this.props.appStore.saveItem(this.store.activeItem, this.props.typeName);
			this.store.closeItem();
		}
	}
}
