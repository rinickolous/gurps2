import { Action, ActionClass, ActionDataModelClasses } from "@data/action/types.ts"
import fields = foundry.data.fields
import { ActionType } from "@util"
import { ActionUtility } from "@data/action/action-utility.ts"
import { ItemDataModel } from "../base.ts"
import type { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.d.mts"

class ActionCollectionField<
	Options extends CollectionField.Options<ActionClass> = CollectionField.DefaultOptions<ActionClass>,
> extends CollectionField<
	ActionClass,
	CollectionField.AssignmentElementType<ActionClass>,
	CollectionField.InitializedElementType<ActionClass>,
	Options
> {
	constructor(options?: Options, context?: fields.DataField.Context) {
		super(new ActionField(), options, context)
	}

	/* -------------------------------------------- */

	override initialize(
		value: CollectionField.PersistedType<any, any, CollectionField.DefaultOptions<any>>,
		model: foundry.abstract.DataModel.Any,
		options?: any,
	): ActionCollection {
		super.initialize(value, model)
		const actions = Object.values(super.initialize(value, model, options) as unknown as Record<string, Action>)
		actions.sort((a, b) => a.sort - b.sort)
		return new ActionCollection(actions)
	}
}

class ActionField<
	Options extends fields.EmbeddedDataField.Options<ActionClass> = fields.EmbeddedDataField.DefaultOptions,
> extends fields.EmbeddedDataField<ActionClass, Options> {
	constructor(options?: Options, context?: fields.DataField.Context) {
		super(ActionUtility, options, context)
	}

	/* -------------------------------------------- */

	override initialize(
		value: fields.EmbeddedDataField.PersistedType<ActionClass, Options>,
		model: ItemDataModel,
		options?: AnyObject,
	): Action {
		super.initialize(value, model)
		const actionClass = this.getModel(value as AnyObject)
		if (actionClass) return new actionClass(value as AnyObject, { parent: model, ...options })
		return foundry.utils.deepClone(value) as Action
	}

	/* -------------------------------------------- */

	getModel(value: AnyObject): ActionClass | null {
		if (Object.hasOwn(value, "type") && Object.keys(ActionDataModelClasses).includes((value as any).type)) {
			return ActionDataModelClasses[(value as any).type as ActionType] as ActionClass
		}
		return null
	}
}

class ActionCollection extends Collection<Action> {
	constructor(entries: Action[]) {
		super(entries.map(e => [e._id, e]))
	}
}

export { ActionCollectionField }
